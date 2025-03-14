import httpStatus from 'http-status';
import { Request, Response } from 'express';

import { orderService } from '@/services';
import { OrderConstant } from '@/constants';
import { catchAsync, response } from '@/utils';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const orderData = req.body;
  const order = await orderService.createOrder(user, orderData);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Tạo đơn hàng thành công.', { order }));
});

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { limit = 10, page = 1, status = OrderConstant.ORDER_STATUS.PENDING } = req.query;
  const { orders, totalOrders } = await orderService.getOrders(user, Number(limit), Number(page), status as string);
  res.status(httpStatus.OK).json(
    response(httpStatus.OK, 'Lấy danh sách đơn hàng thành công.', {
      orders,
      limit: Number(limit),
      currentPage: Number(page),
      totalPages: Math.ceil(totalOrders / Number(limit)),
      totalOrders,
    }),
  );
});

const getOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { orderId } = req.params;
  const order = await orderService.getOrder(user, orderId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Lấy thông tin đơn hàng thành công.', { order }));
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { orderId } = req.params;
  await orderService.cancelOrder(user, orderId);
  res.status(httpStatus.NO_CONTENT).json(response(httpStatus.NO_CONTENT, 'Huỷ đơn hàng thành công.'));
});

export { createOrder, getOrders, getOrder, cancelOrder };
