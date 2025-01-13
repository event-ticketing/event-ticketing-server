import express from 'express';

import userRoute from '@/routes/user.route';
import authRoute from '@/routes/auth.route';
import eventRoute from '@/routes/event.route';

const router = express.Router();

router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/events', eventRoute);

export default router;
