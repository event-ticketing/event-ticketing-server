import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';

import { User } from '@/models';
import { ApiError, catchAsync } from '@/utils';
import { TOKEN_TYPE, TokenType } from '@/constants/jwt.constant';
import { extractToken, verifyToken } from '@/services/jwt.service';

const auth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Vui lòng đăng nhập để tiếp tục.');
  }

  const payload = verifyToken(token, TOKEN_TYPE.ACCESS as TokenType);

  const { id } = payload;
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Tài khoản không tồn tại.');
  }

  req.user = user;
  next();
});

const author = (allowedRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền truy cập.');
    }
    next();
  });
};

export { auth, author };
