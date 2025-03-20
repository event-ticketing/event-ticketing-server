import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { VerifyIpnCall, VerifyReturnUrl } from 'vnpay';

import { paymentService } from '@/services';
import { catchAsync, response } from '@/utils';

const createVNPayPayment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { orderId } = req.body;
  const paymentUrl = await paymentService.createVNPayPayment(user, orderId, req);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Tạo thanh toán thành công.', { paymentUrl }));
});

const handleVNPayIPN = catchAsync(async (req: Request, res: Response) => {
  const ipn = await paymentService.handleVNPayIPN(req.query as unknown as VerifyIpnCall);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Xử lý thanh toán thành công.', { ipn }));
});

const handleVNPayReturn = catchAsync(async (req: Request, res: Response) => {
  const vnpayReturn = await paymentService.handleVNPayReturn(req.query as unknown as VerifyReturnUrl);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Xử lý thanh toán thành công.', { vnpayReturn }));
});

export { createVNPayPayment, handleVNPayReturn, handleVNPayIPN };
