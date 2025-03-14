import httpStatus from 'http-status';

import { ApiError } from '@/utils';
import { voucherService } from '@/services';
import { IOrder, IUser, IVoucher, Order, Ticket, TicketType } from '@/models';
import { OrderConstant, TicketConstant, TicketTypeConstant } from '@/constants';

const createOrder = async (user: IUser, orderData: any): Promise<IOrder> => {
  const { ticketTypeId, quantity, voucherCode } = orderData;

  const ticketType = await TicketType.findById(ticketTypeId);
  if (!ticketType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vé không tồn tại.');
  }

  if (quantity < ticketType.minQtyPerOrder || quantity > ticketType.maxQtyPerOrder) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Số lượng vé không hợp lệ.');
  }

  if (quantity > ticketType.quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Số lượng vé không đủ.');
  }

  if (
    ticketType.startTime > new Date() ||
    ticketType.endTime < new Date() ||
    ticketType.status === TicketTypeConstant.TICKET_TYPE_STATUS.SOLD
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Vé không còn hiệu lực.');
  }

  let totalAmount = ticketType.price * quantity;
  let discountAmount = 0;
  let finalAmount = totalAmount;

  if (ticketType.isFree) totalAmount = finalAmount = 0;

  let voucher = null;
  if (voucherCode) {
    voucher = await voucherService.getVoucherByCode(voucherCode);
    discountAmount = await voucherService.getDiscountAmount(totalAmount, voucher);
    finalAmount = totalAmount - discountAmount;

    if (voucher.isLimited && voucher.usageCount >= voucher.usageLimit) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Mã giảm giá đã hết lượt sử dụng.');
    }

    voucher.usageCount += 1;
    await voucher.save();
  }

  const order = await Order.create({
    user: user._id,
    totalAmount,
    discountAmount,
    finalAmount,
    status: finalAmount === 0 ? OrderConstant.ORDER_STATUS.COMPLETED : OrderConstant.ORDER_STATUS.PENDING,
    voucher: voucher ? (voucher as IVoucher)._id : null,
  });

  ticketType.quantity -= quantity;
  await ticketType.save();

  const tickets = Array.from({ length: quantity }, () => ({
    order: order._id,
    ticketType: ticketType._id,
    purchasedDate: order.createdAt,
    status: TicketConstant.TICKET_STATUS.PENDING,
  }));
  await Ticket.insertMany(tickets);

  return order;
};

const getOrders = async (
  user: IUser,
  limit: number,
  page: number,
  status: string,
): Promise<{ orders: IOrder[]; totalOrders: number }> => {
  const skip = (page - 1) * limit;

  const filters: Record<string, any> = { user: user._id };

  if (status && Object.values(OrderConstant.ORDER_STATUS).includes(status)) {
    filters.status = status;
  }

  const [orders, totalOrders] = await Promise.all([
    Order.find(filters).limit(limit).skip(skip).populate('user').lean(),
    Order.countDocuments(filters),
  ]);

  return { orders, totalOrders };
};

const getOrder = async (user: IUser, orderId: string): Promise<IOrder> => {
  const order = await Order.findOne({ _id: orderId, user: user._id }).populate('user voucher').lean();
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Đơn hàng không tồn tại.');
  }

  return order;
};

const cancelOrder = async (user: IUser, orderId: string): Promise<void> => {
  const order = await Order.findOne({ _id: orderId, user: user._id });
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Đơn hàng không tồn tại.');
  }

  const tickets = await Ticket.find({ order: order._id });
  if (!tickets.length) return;

  const ticketTypeIds = [...new Set(tickets.map((ticket) => ticket.ticketType))];

  await Ticket.updateMany({ order: order._id }, { status: TicketConstant.TICKET_STATUS.CANCELLED });

  await TicketType.updateMany({ _id: { $in: ticketTypeIds } }, { $inc: { quantity: tickets.length } });

  order.status = OrderConstant.ORDER_STATUS.CANCELLED;
  await order.save();
};

export { createOrder, getOrders, getOrder, cancelOrder };
