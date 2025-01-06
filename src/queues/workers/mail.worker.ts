import nodemailer from 'nodemailer';

import env from '@/config/env';
import logger from '@/config/logger';
import { createWorker } from '@/config/bullmq';

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

  try {
    await transporter.sendMail({ from: env.email.user, to, subject, text });
    logger.info(`Email sent to ${to}`);
  } catch (error: any) {
    logger.error(`Error sending email to ${to}: ${error.message}`);
    throw error;
  }
});

export default emailWorker;
