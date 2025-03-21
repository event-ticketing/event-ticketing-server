import joi from 'joi';

import { VoucherConstant } from '@/constants';
import { objectId } from '@/validations/custom.validation';

const createVoucher = {
  body: joi.object({
    name: joi.string().required(),
    code: joi.string().required(),
    voucherType: joi
      .string()
      .valid(...Object.values(VoucherConstant.VOUCHER_TYPE))
      .required(),
    discount: joi.number().required(),
    maxDiscount: joi.number().required(),
    expiredDate: joi.date().required(),
    status: joi
      .string()
      .default(VoucherConstant.VOUCHER_STATUS.INACTIVE)
      .valid(...Object.values(VoucherConstant.VOUCHER_STATUS)),
    isLimited: joi.boolean().default(false).required(),
    usageLimit: joi.number().min(0).default(0).required(),
    usageCount: joi.number().min(joi.ref('usageLimit')).default(0).required(),
  }),
};

const getVouchers = {
  query: joi.object({
    limit: joi.number().default(10),
    page: joi.number().default(1),
    keyword: joi.string().allow(null, ''),
  }),
};

const getVoucherByCode = {
  params: joi.object({
    voucherCode: joi.string().required(),
  }),
};

const getVoucherById = {
  params: joi.object({
    voucherId: joi.string().custom(objectId).required(),
  }),
};

const getDiscountAmount = {
  body: joi.object({
    totalAmount: joi.number().min(0).required(),
    voucherCode: joi.string().required(),
  }),
};

const updateVoucher = {
  params: joi.object({
    voucherId: joi.string().custom(objectId).required(),
  }),
  body: joi.object({
    name: joi.string(),
    code: joi.string(),
    voucherType: joi.string().valid(...Object.values(VoucherConstant.VOUCHER_TYPE)),
    discount: joi.number(),
    maxDiscount: joi.number(),
    expiredDate: joi.date(),
    status: joi.string().valid(...Object.values(VoucherConstant.VOUCHER_STATUS)),
    isLimited: joi.boolean(),
    usageLimit: joi.number().min(0),
    usageCount: joi.number().min(joi.ref('usageLimit')),
  }),
};

const deleteVoucher = {
  params: joi.object({
    voucherId: joi.string().custom(objectId).required(),
  }),
};

export {
  createVoucher,
  getVouchers,
  getVoucherByCode,
  getVoucherById,
  getDiscountAmount,
  updateVoucher,
  deleteVoucher,
};
