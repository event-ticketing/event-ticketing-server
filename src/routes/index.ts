import express from 'express';

import userRoute from '@/routes/user.route';

const router = express.Router();

router.use('/users', userRoute);

export default router;
