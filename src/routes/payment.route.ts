import express from 'express';

import { auth, validate } from '@/middlewares';
import { paymentController } from '@/controllers';
import { paymentValidation } from '@/validations';

const paymentRouter = express.Router();

paymentRouter.get('/vnpay-ipn', paymentController.handleVNPayIPN);

paymentRouter.use(auth);

paymentRouter.post('/vnpay', validate(paymentValidation.createVNPayPayment), paymentController.createVNPayPayment);

paymentRouter.get('/vnpay-return', paymentController.handleVNPayReturn);

export default paymentRouter;
