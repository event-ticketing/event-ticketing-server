import express from 'express';

import userRoute from '@/routes/user.route';
import authRoute from '@/routes/auth.route';
import eventRoute from '@/routes/event.route';
import orderRoute from '@/routes/order.route';
import paymentRoute from '@/routes/payment.route';
import voucherRoute from '@/routes/voucher.route';
import ticketRoute from '@/routes/ticket.route';

const router = express.Router();

router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/events', eventRoute);
router.use('/orders', orderRoute);
router.use('/payment', paymentRoute);
router.use('/vouchers', voucherRoute);
router.use('/tickets', ticketRoute);

export default router;
