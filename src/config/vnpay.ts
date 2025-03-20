import { VNPay } from 'vnpay';

import env from '@/config/env';

const vnpay = new VNPay({
  tmnCode: env.vnpay.tmnCode,
  secureSecret: env.vnpay.secureSecret,
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
});

export default vnpay;
