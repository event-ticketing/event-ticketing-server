import express from 'express';

import { auth, validate } from '@/middlewares';
import { ticketTypeValidation } from '@/validations';
import { ticketTypeController } from '@/controllers';

const ticketTypeRouter = express.Router({ mergeParams: true });

ticketTypeRouter.get(
  '/',
  validate(ticketTypeValidation.getTicketTypesOfShow),
  ticketTypeController.getTicketTypesOfShow,
);

ticketTypeRouter.get(
  '/:ticketTypeId',
  validate(ticketTypeValidation.getTicketType),
  ticketTypeController.getTicketType,
);

ticketTypeRouter.use(auth);

ticketTypeRouter.post('/', validate(ticketTypeValidation.createTicketType), ticketTypeController.createTicketType);

ticketTypeRouter.put(
  '/:ticketTypeId',
  validate(ticketTypeValidation.updateTicketType),
  ticketTypeController.updateTicketType,
);

ticketTypeRouter.delete(
  '/:ticketTypeId',
  validate(ticketTypeValidation.deleteTicketType),
  ticketTypeController.deleteTicketType,
);

export default ticketTypeRouter;
