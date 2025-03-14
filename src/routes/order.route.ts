import express from 'express';

import { auth, validate } from '@/middlewares';
import { orderValidation } from '@/validations';
import { orderController } from '@/controllers';

const orderRouter = express.Router();

orderRouter.use(auth);

orderRouter.post('/', validate(orderValidation.createOrder), orderController.createOrder);

orderRouter.get('/', validate(orderValidation.getOrders), orderController.getOrders);

orderRouter.get('/:orderId', validate(orderValidation.getOrder), orderController.getOrder);

orderRouter.patch('/cancel/:orderId', validate(orderValidation.cancelOrder), orderController.cancelOrder);

export default orderRouter;
