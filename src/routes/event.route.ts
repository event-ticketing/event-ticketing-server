import express from 'express';

import showRouter from '@/routes/show.route';
import { eventValidation } from '@/validations';
import { eventController } from '@/controllers';
import { auth, uploadMultiple, validate } from '@/middlewares';

const eventRouter = express.Router();

eventRouter.get('/', validate(eventValidation.getEvents), eventController.getEvents);

eventRouter.get('/:id', validate(eventValidation.getEventById), eventController.getEventById);

eventRouter.use('/:eventId/shows', showRouter);

eventRouter.use(auth);

eventRouter.post(
  '/',
  uploadMultiple([
    { name: 'logoURL', maxCount: 1 },
    { name: 'coverURL', maxCount: 1 },
    { name: 'organizerLogoURL', maxCount: 1 },
  ]),
  validate(eventValidation.createEvent),
  eventController.createEvent,
);

eventRouter.put(
  '/:id',
  uploadMultiple([
    { name: 'logoURL', maxCount: 1 },
    { name: 'coverURL', maxCount: 1 },
    { name: 'organizerLogoURL', maxCount: 1 },
  ]),
  validate(eventValidation.updateEvent),
  eventController.updateEvent,
);

eventRouter.delete('/:id', validate(eventValidation.deleteEvent), eventController.deleteEvent);

export default eventRouter;
