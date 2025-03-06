import express from 'express';

import { showController } from '@/controllers';
import { showValidation } from '@/validations';
import { auth, validate } from '@/middlewares';

const showRouter = express.Router({ mergeParams: true });

showRouter.get('/', validate(showValidation.getShowsOfEvent), showController.getShowsOfEvent);

showRouter.get('/:showId', validate(showValidation.getShow), showController.getShow);

showRouter.use(auth);

showRouter.post('/', validate(showValidation.createShow), showController.createShow);

showRouter.put('/:showId', validate(showValidation.updateShow), showController.updateShow);

showRouter.delete('/:showId', validate(showValidation.deleteShow), showController.deleteShow);

export default showRouter;
