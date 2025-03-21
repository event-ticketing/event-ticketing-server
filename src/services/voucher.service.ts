import httpStatus from 'http-status';

import { ApiError } from '@/utils';
import { IVoucher, Voucher } from '@/models';
import { VoucherConstant } from '@/constants';

const createVoucher = async (voucherData: IVoucher): Promise<IVoucher> => {
  const { code } = voucherData;

  const isExist = await Voucher.findOne({ code });

  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Mã giảm giá đã tồn tại.');
  }

  const voucher = await Voucher.create(voucherData);

  return voucher;
};

const getVouchers = async (
  limit: number,
  page: number,
  filters: Record<string, any>,
): Promise<{ vouchers: IVoucher[]; totalVouchers: number }> => {
  const skip = (page - 1) * limit;

  const [vouchers, totalVouchers] = await Promise.all([
    Voucher.find(filters).limit(limit).skip(skip).lean(),
    Voucher.countDocuments(filters),
  ]);

  return { vouchers, totalVouchers };
};

const validateVoucher = async (voucher: IVoucher): Promise<void> => {
  if (voucher.expiredDate < new Date() || voucher.status === VoucherConstant.VOUCHER_STATUS.INACTIVE) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mã giảm giá không còn hiệu lực.');
  }

  if (voucher.isLimited && voucher.usageCount >= voucher.usageLimit) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mã giảm giá đã hết lượt sử dụng.');
  }
};

const getVoucherById = async (voucherId: string): Promise<IVoucher> => {
  const voucher = await Voucher.findById(voucherId);
  if (!voucher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mã giảm giá không tồn tại.');
  }

  validateVoucher(voucher);
  return voucher;
};

const getVoucherByCode = async (voucherCode: string): Promise<IVoucher> => {
  const voucher = await Voucher.findOne({ code: voucherCode });
  if (!voucher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mã giảm giá không tồn tại.');
  }

  validateVoucher(voucher);
  return voucher;
};

const getDiscountAmount = async (totalAmount: number, voucher: IVoucher): Promise<number> => {
  validateVoucher(voucher);
  let discountAmount = 0;

  if (voucher.voucherType === VoucherConstant.VOUCHER_TYPE.PERCENTAGE) {
    discountAmount = (totalAmount * voucher.discount) / 100;
  } else {
    discountAmount = voucher.discount;
  }

  if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
    discountAmount = voucher.maxDiscount;
  }

  return discountAmount;
};

const updateVoucher = async (voucherId: string, updateBody: Partial<IVoucher>): Promise<IVoucher> => {
  const voucher = await Voucher.findById(voucherId);
  if (!voucher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mã giảm giá không tồn tại.');
  }

  if (updateBody.code && voucher.code !== updateBody.code) {
    const isExist = await Voucher.findOne({
      code: updateBody.code,
      _id: { $ne: voucherId },
    });

    if (isExist) {
      throw new ApiError(httpStatus.CONFLICT, 'Mã giảm giá đã tồn tại.');
    }
  }

  Object.assign(voucher, updateBody);
  await voucher.save();

  return voucher;
};

const deleteVoucher = async (voucherId: string): Promise<void> => {
  const voucher = await Voucher.findById(voucherId);
  if (!voucher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mã giảm giá không tồn tại.');
  }

  await Voucher.findByIdAndDelete(voucherId);
};

export {
  createVoucher,
  getVouchers,
  getVoucherById,
  getVoucherByCode,
  getDiscountAmount,
  updateVoucher,
  deleteVoucher,
};
