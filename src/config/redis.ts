import { Redis } from 'ioredis';

import env from '@/config/env';

const redisClient = new Redis({
  host: env.redis.host,
  port: env.redis.port,
  password: env.redis.password,
  maxRetriesPerRequest: null,
});

export default redisClient;
