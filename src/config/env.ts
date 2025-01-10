require('dotenv').config();

const env = {
  server: {
    nodeEnv: process.env.NODE_ENV || 'development',
    host: process.env.SERVER_HOST || 'http://localhost',
    port: +(process.env.SERVER_PORT || 3000),
  },
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/event-ticketing-db',
  logLevel: process.env.LOG_LEVEL || 'info',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: +(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || 'password',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: +(process.env.EMAIL_PORT || 587),
    user: process.env.EMAIL_USER || 'user',
    pass: process.env.EMAIL_PASS || 'pass',
  },
  encrypt: {
    ivLength: +(process.env.ENCRYPT_IV_LENGTH || 16),
    key: process.env.ENCRYPT_KEY || 'key',
  },
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
      expiry: process.env.JWT_ACCESS_EXPIRY || '1d',
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      expiry: process.env.JWT_REFRESH_EXPIRY || '15d',
    },
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'cloud-name',
    apiKey: process.env.CLOUDINARY_API_KEY || 'api-key',
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

export default env;
