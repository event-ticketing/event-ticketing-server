import joi from 'joi';

import { OrderConstant } from '@/constants';
import { objectId } from '@/validations/custom.validation';

const createOrder = {
  body: joi.object().keys({
    ticketTypeId: joi.string().custom(objectId).required(),
    quantity: joi.number().required(),
    voucherCode: joi.string().allow(null, ''),
  }),
};

const getOrders = {
  query: joi.object().keys({
    limit: joi.number().default(10),
    page: joi.number().default(1),
    status: joi
      .string()
      .valid(...Object.values(OrderConstant.ORDER_STATUS))
      .allow(null, ''),
  }),
};

const getOrder = {
  params: joi.object().keys({
    orderId: joi.string().custom(objectId).required(),
  }),
};

const cancelOrder = {
  params: joi.object().keys({
    orderId: joi.string().custom(objectId).required(),
  }),
};

export { createOrder, getOrders, getOrder, cancelOrder };
