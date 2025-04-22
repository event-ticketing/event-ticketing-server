import express from 'express';

import { ticketController } from '@/controllers';
import { auth, validate } from '@/middlewares';
import { ticketValidation } from '@/validations';

const ticketRouter = express.Router();

ticketRouter.use(auth);

ticketRouter.post('/verify', validate(ticketValidation.verifyTicket), ticketController.verifyTicket);

ticketRouter.get('/:ticketId', validate(ticketValidation.getTicketById), ticketController.getTicketById);

ticketRouter.get(
  '/:ticketId/qrcode',
  validate(ticketValidation.generateTicketQRCode),
  ticketController.generateTicketQRCode,
);

export default ticketRouter;
