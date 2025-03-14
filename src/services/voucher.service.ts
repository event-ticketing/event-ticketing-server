import { ApiError } from '@/utils';
import { IVoucher, Voucher } from '@/models';
import { VoucherConstant } from '@/constants';

const getVoucherById = async (voucherId: string) => {
  const voucher = await Voucher.findById(voucherId);
  if (!voucher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mã giảm giá không tồn tại.');
  }

  if (voucher.expiredDate < new Date() || voucher.status === VoucherConstant.VOUCHER_STATUS.INACTIVE) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mã giảm giá không còn hiệu lực.');
  }

  if (voucher.isLimited && voucher.usageCount >= voucher.usageLimit) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mã giảm giá đã hết lượt sử dụng.');
  }

  return voucher;
};

const getVoucherByCode = async (voucherCode: string) => {
  const voucher = await Voucher.findOne({ code: voucherCode });
  if (!voucher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mã giảm giá không tồn tại.');
  }

  if (voucher.expiredDate < new Date() || voucher.status === VoucherConstant.VOUCHER_STATUS.INACTIVE) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mã giảm giá không còn hiệu lực.');
  }

  if (voucher.isLimited && voucher.usageCount >= voucher.usageLimit) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mã giảm giá đã hết lượt sử dụng.');
  }

  return voucher;
};

const getDiscountAmount = async (totalAmount: number, voucher: IVoucher) => {
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

export { getVoucherById, getVoucherByCode, getDiscountAmount };
