import nodemailer from 'nodemailer';

import { createQueue, createWorker } from '@/config/bullmq';
import env from '@/config/env';
import logger from '@/config/logger';

const emailQueue = createQueue('emailQueue');

const emailWorker = createWorker('emailQueue', async (job: any) => {
  const { to, subject, text } = job.data;

  const transporter = nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    auth: {
      user: env.email.user,
      pass: env.email.pass,
    },
  });

  await transporter.sendMail({ from: env.email.user, to, subject, text });
  logger.info(`Email sent to ${to}`);
});

const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
  await emailQueue.add('sendOtp', {
    to: email,
    subject: 'Event Ticketing - Xác thực OTP',
    text: `Mã OTP của bạn là: ${otp}`,
  });
};

export { sendOtpEmail };
