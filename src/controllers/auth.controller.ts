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
  const resetPasswordToken = await authService.verifyOtp(email, otp, context);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Xác thực OTP thành công.', { resetPasswordToken }));
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  const { accessToken, refreshToken } = await authService.login(identifier, password);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Đăng nhập thành công.', { accessToken, refreshToken }));
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const { accessToken } = await authService.refreshToken(refreshToken);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Làm mới token thành công.', { accessToken }));
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Mã OTP đã được gửi đến email của bạn.'));
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { resetPasswordToken, password } = req.body;
  await authService.resetPassword(resetPasswordToken, password);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Đặt lại mật khẩu thành công.'));
});

export { signUp, verifyOtp, login, refreshToken, forgotPassword, resetPassword };
