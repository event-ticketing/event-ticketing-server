import mongoose from 'mongoose';

import env from '@/config/env';
import logger from '@/config/logger';

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info('Connected to the database');
  } catch (error: any) {
    logger.error(`Failed to connect to the database: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
