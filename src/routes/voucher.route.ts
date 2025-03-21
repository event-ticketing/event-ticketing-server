import express from 'express';

import { UserConstant } from '@/constants';
import { voucherController } from '@/controllers';
import { voucherValidation } from '@/validations';
import { auth, author, validate } from '@/middlewares';

const voucherRoute = express.Router();

voucherRoute.use(auth);

voucherRoute.post(
  '/',
  author([UserConstant.USER_ROLE.ADMIN]),
  validate(voucherValidation.createVoucher),
  voucherController.createVoucher,
);

voucherRoute.get(
  '/',
  author([UserConstant.USER_ROLE.ADMIN]),
  validate(voucherValidation.getVouchers),
  voucherController.getVouchers,
);

voucherRoute.get('/:voucherCode', validate(voucherValidation.getVoucherByCode), voucherController.getVoucherByCode);

voucherRoute.get('/:voucherId', validate(voucherValidation.getVoucherById), voucherController.getVoucherById);

voucherRoute.get(
  '/discount-amount',
  validate(voucherValidation.getDiscountAmount),
  voucherController.getDiscountAmount,
);

voucherRoute.put(
  '/:voucherId',
  author([UserConstant.USER_ROLE.ADMIN]),
  validate(voucherValidation.updateVoucher),
  voucherController.updateVoucher,
);

voucherRoute.delete(
  '/:voucherId',
  author([UserConstant.USER_ROLE.ADMIN]),
  validate(voucherValidation.getVoucherById),
  voucherController.deleteVoucher,
);

export default voucherRoute;
