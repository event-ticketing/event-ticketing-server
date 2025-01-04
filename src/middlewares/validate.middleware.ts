import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';

import { ApiError } from '@/utils';

const validate = (schemas: { [key: string]: ObjectSchema }) => (req: Request, _res: Response, next: NextFunction) => {
  try {
    for (const key in schemas) {
      if (schemas[key]) {
        const { error } = schemas[key].validate(req[key as keyof Request], { abortEarly: false });
        if (error) {
          const message = error.details
            .map((detail) => detail.message)
            .join(', ')
            .replace(/['"]+/g, '');
          return next(new ApiError(httpStatus.BAD_REQUEST, message));
        }
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

export default validate;
