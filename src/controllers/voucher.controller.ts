import httpStatus from 'http-status';
import { Request, Response } from 'express';

import { voucherService } from '@/services';
import { catchAsync, response } from '@/utils';

const createVoucher = catchAsync(async (req: Request, res: Response) => {
  const voucher = await voucherService.createVoucher(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Tạo mã giảm giá thành công.', { voucher }));
});

const getVouchers = catchAsync(async (req: Request, res: Response) => {
  const { limit = 10, page = 1, keyword } = req.query;

  const filters: Record<string, any> = {};

  if (keyword) {
    filters.$or = [{ name: { $regex: keyword, $options: 'i' } }, { code: { $regex: keyword, $options: 'i' } }];
  }

  const vouchers = await voucherService.getVouchers(Number(limit), Number(page), filters);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Lấy danh sách mã giảm giá thành công.', { vouchers }));
});

const getVoucherByCode = catchAsync(async (req: Request, res: Response) => {
  const { voucherCode } = req.params;
  const voucher = await voucherService.getVoucherByCode(voucherCode);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Lấy thông tin mã giảm giá thành công', { voucher }));
});

const getVoucherById = catchAsync(async (req: Request, res: Response) => {
  const { voucherId } = req.params;
  const voucher = await voucherService.getVoucherById(voucherId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Lấy thông tin mã giảm giá thành công.', { voucher }));
});

const getDiscountAmount = catchAsync(async (req: Request, res: Response) => {
  const { totalAmount, voucherCode } = req.body;
  const voucher = await voucherService.getVoucherByCode(voucherCode);
  const discountAmount = await voucherService.getDiscountAmount(totalAmount, voucher);
  res
    .status(httpStatus.OK)
    .json(response(httpStatus.OK, 'Lấy thông tin số tiền giảm giá thành công.', { discountAmount }));
});

const updateVoucher = catchAsync(async (req: Request, res: Response) => {
  const { voucherId } = req.params;
  const voucher = await voucherService.updateVoucher(voucherId, req.body);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật thông tin mã giảm giá thành công.', { voucher }));
});

const deleteVoucher = catchAsync(async (req: Request, res: Response) => {
  const { voucherId } = req.params;
  await voucherService.deleteVoucher(voucherId);
  res.status(httpStatus.NO_CONTENT).json(response(httpStatus.NO_CONTENT, 'Xóa mã giảm giá thành công.'));
});

export {
  createVoucher,
  getVouchers,
  getVoucherById,
  getVoucherByCode,
  getDiscountAmount,
  updateVoucher,
  deleteVoucher,
};
