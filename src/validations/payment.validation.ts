import joi from 'joi';

const createVNPayPayment = {
  body: joi.object().keys({
    orderId: joi.string().required(),
  }),
};

export { createVNPayPayment };
