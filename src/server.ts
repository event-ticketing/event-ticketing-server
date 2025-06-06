import mongoose from 'mongoose';
import 'tsconfig-paths/register';
import httpStatus from 'http-status';
import express, { Request, Response } from 'express';

import router from '@/routes';
import env from '@/config/env';
import connectDB from '@/config/db';
import logger from '@/config/logger';
import response from '@/utils/response';
import morganMiddleware from '@/config/morgan';
import emailWorker from '@/queues/workers/mail.worker';
import { errorConverter, errorHandler } from '@/middlewares';
import { scheduleReminderEmails } from '@/queues/notification.queue';
import notificationWorker from '@/queues/workers/notification.worker';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', true);

if (env.server.nodeEnv === 'development') {
  app.use(morganMiddleware);
  mongoose.set('debug', true);
}

app.use('/api/v1', router);

app.get('/', (_req: Request, res: Response) => {
  res.send('Server is running');
});

app.get('/health-check', (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json(
    response(httpStatus.OK, 'Server is running', {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: env.server.nodeEnv,
    }),
  );
});

app.all('*', (_req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json(response(httpStatus.NOT_FOUND, 'Không tìm thấy tài nguyên.'));
});

app.use(errorConverter);
app.use(errorHandler);

scheduleReminderEmails();

connectDB()
  .then(() => {
    emailWorker
      .on('ready', () => {
        logger.info('Connected to email server and email worker is ready');
      })
      .on('error', (error: any) => {
        logger.error(`Email worker error: ${error.message}`);
      });
    notificationWorker
      .on('ready', () => {
        logger.info('Notification worker is ready');
      })
      .on('error', (error: any) => {
        logger.error(`Notification worker error: ${error.message}`);
      });
  })
  .then(() => {
    app.listen(env.server.port, () => {
      logger.info(`Server is running on ${env.server.host}:${env.server.port}`);
    });
  })
  .catch((error) => {
    logger.error(`Failed to connect to the database: ${error.message}`);
    process.exit(1);
  });
