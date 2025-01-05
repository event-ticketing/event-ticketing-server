import { Queue, Worker } from 'bullmq';

import redisClient from '@/config/redis';

const createQueue = (queueName: string) => {
  return new Queue(queueName, { connection: redisClient });
};

const createWorker = (queueName: string, processor: any) => {
  return new Worker(queueName, processor, { connection: redisClient });
};

export { createQueue, createWorker };
