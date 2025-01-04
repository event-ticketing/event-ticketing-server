require('dotenv').config();

const env = {
  server: {
    nodeEnv: process.env.NODE_ENV || 'development',
    host: process.env.SERVER_HOST || 'http://localhost',
    port: process.env.SERVER_PORT || 3000,
  },
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/event-ticketing-db',
  logLevel: process.env.LOG_LEVEL || 'info',
};

export default env;
