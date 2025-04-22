import { Request } from 'express';
import httpStatus from 'http-status';
import { IpnResponse, IpnSuccess, ProductCode, VerifyIpnCall, VerifyReturnUrl, VnpLocale, dateFormat } from 'vnpay';

import { ApiError } from '@/utils';
import vnpay from '@/config/vnpay';
import { IUser, Order, Ticket } from '@/models';
import { OrderConstant, TicketConstant } from '@/constants';

const createVNPayPayment = async (user: IUser, orderId: string, req: Request): Promise<string> => {
  const order = await Order.findOne({ _id: orderId, user: user._id });
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Đơn hàng không tồn tại.');
  }

  if (order.status === OrderConstant.ORDER_STATUS.COMPLETED) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Đơn hàng đã được thanh toán.');
  }

  const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: order.finalAmount,
    vnp_IpAddr: (req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip) as string,
    vnp_TxnRef: order._id.toString(),
    vnp_OrderInfo: `Thanh toan don hang ${order._id}`,
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: 'http://localhost:3000/api/v1/payment/vnpay-return',
    vnp_Locale: VnpLocale.VN,
    vnp_CreateDate: dateFormat(new Date()),
    vnp_ExpireDate: dateFormat(new Date(Date.now() + 15 * 60 * 60 * 1000)),
  });

  return paymentUrl;
};

const handleVNPayIPN = async (ipnQuery: VerifyIpnCall): Promise<IpnResponse> => {
  const verify: VerifyIpnCall = vnpay.verifyIpnCall(ipnQuery);
  if (!verify.isVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Thanh toán không hợp lệ.');
  }

  if (!verify.isSuccess) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Thanh toán thất bại.');
  }

  const order = await Order.findById(verify.vnp_TxnRef);

  if (!order || verify.vnp_TxnRef != order._id.toString()) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Đơn hàng không tồn tại.');
  }

  if (verify.vnp_Amount !== order.finalAmount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Số tiền thanh toán không chính xác.');
  }

  if (order.status === OrderConstant.ORDER_STATUS.COMPLETED) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Đơn hàng đã được thanh toán.');
  }

  order.status = OrderConstant.ORDER_STATUS.COMPLETED;
  await order.save();

  const tickets = await Ticket.find({ order: order._id });
  for (const ticket of tickets) {
    ticket.status = TicketConstant.TICKET_STATUS.SUCCESS;
    await ticket.save();
  }

  return IpnSuccess;
};

const handleVNPayReturn = async (returnQuery: VerifyReturnUrl): Promise<IpnResponse> => {
  await handleVNPayIPN(returnQuery);
  const verify: VerifyReturnUrl = vnpay.verifyReturnUrl(returnQuery);
  if (!verify.isVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Thanh toán không hợp lệ.');
  }

  if (!verify.isSuccess) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Thanh toán thất bại.');
  }

  return IpnSuccess;
};

export { createVNPayPayment, handleVNPayIPN, handleVNPayReturn };
