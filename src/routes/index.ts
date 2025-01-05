import express from 'express';

import userRoute from '@/routes/user.route';
import authRoute from '@/routes/auth.route';

const router = express.Router();

router.use('/users', userRoute);
router.use('/auth', authRoute);

export default router;
