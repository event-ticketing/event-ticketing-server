import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';

import env from '@/config/env';
import ApiError from '@/utils/ApiError';
import multer from 'multer';

interface CustomError {
  statusCode: number;
  message: string;
  isOperational?: boolean;
  stack?: string;
}

const errorConverter = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  let error = err as CustomError;

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      error = new ApiError(httpStatus.BAD_REQUEST, 'File quá lớn');
    }
    error = new ApiError(httpStatus.BAD_REQUEST, error.message);
  }

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message;
    error = new ApiError(statusCode, message, false, err instanceof Error ? err.stack : undefined);
  }

  next(error);
};

const errorHandler = async (err: CustomError, req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message } = err;

  if (env.server.nodeEnv === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'Đã có lỗi xảy ra, vui lòng thử lại sau';
  }

  res.locals.errorMessage = err.message;

  const response = {
    statusCode,
    message,
    ...(env.server.nodeEnv === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
