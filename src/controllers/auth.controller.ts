import httpStatus from 'http-status';
import { Request, Response } from 'express';

import { authService } from '@/services';
import { catchAsync, response } from '@/utils';

const signUp = catchAsync(async (req: Request, res: Response) => {
  await authService.signUp(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Đăng ký thành công.'));
});

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, otp, context } = req.body;
  await authService.verifyOtp(email, otp, context);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Xác thực OTP thành công.'));
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  const user = await authService.login(identifier, password);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Đăng nhập thành công.', user));
});

export { signUp, verifyOtp, login };
