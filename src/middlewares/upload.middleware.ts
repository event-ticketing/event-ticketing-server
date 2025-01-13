import httpStatus from 'http-status';
import multer, { FileFilterCallback } from 'multer';
import { NextFunction, Request, Response } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import { ApiError } from '@/utils';
import { CommonConstant } from '@/constants';
import cloudinary from '@/config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (CommonConstant.ALLOW_UPLOAD_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(httpStatus.BAD_REQUEST, 'Định dạng tệp không hợp lệ.'));
  }
};

const cloudUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: CommonConstant.MAX_UPLOAD_SIZE,
  },
});

const upload = (fieldName: string) => (req: Request, res: Response, next: NextFunction) =>
  cloudUpload.single(fieldName)(req, res, (err) => {
    if (err) {
      next(err);
    }
    next();
  });

const uploadMultiple =
  (fields: { name: string; maxCount: number }[]) => (req: Request, res: Response, next: NextFunction) =>
    cloudUpload.fields(fields)(req, res, (err) => {
      if (err) {
        next(err);
      }
      next();
    });

export default upload;

export { uploadMultiple };
