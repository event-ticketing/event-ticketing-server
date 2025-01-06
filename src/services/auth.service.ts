import httpStatus from 'http-status';

import { emailQueue } from '@/queues';
import { IUser, User } from '@/models';
import { userService, otpService, jwtService } from '@/services';
import { ApiError, crypto, generateOtp } from '@/utils';
import { TOKEN_TYPE } from '@/constants/jwt.constant';

const signUp = async (userData: Partial<IUser>): Promise<void> => {
  const { email } = userData;

  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email không được để trống.');
  }

  const isExist = await User.findOne({ email });
  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Email đã tồn tại. Vui lòng nhập email khác.');
  }

  const otp = generateOtp();
  const encryptedOtp = crypto.encrypt(otp);

  await otpService.saveOtp(`otp:signup:${email}`, encryptedOtp);
  await emailQueue.sendOtpEmail(email, otp);

  const user = await userService.createUser(userData);
  await user.save();
};

const verifyOtp = async (email: string, otp: string, context: string): Promise<void> => {
  const isOtpValid = await otpService.verifyOtp(`otp:${context}:${email}`, otp);
  if (!isOtpValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mã OTP không hợp lệ.');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại.');
  }

  if (context === 'signup') {
    user.isVerified = true;
    await user.save();
    return;
  } else if (context === 'forgot-password') {
    return;
  }
};

const login = async (identifier: string, password: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await User.findOne({ $or: [{ email: identifier }, { phoneNumber: identifier }] }).select('+password');

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Tài khoản chưa tồn tại. Vui lòng đăng ký tài khoản mới.');
  }

  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Thông tin đăng nhập không hợp lệ.');
  }

  const accessToken = jwtService.generateToken({ id: user.id }, TOKEN_TYPE.ACCESS);
  const refreshToken = jwtService.generateToken({ id: user.id }, TOKEN_TYPE.REFRESH);

  return { accessToken, refreshToken };
};

const refreshToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
  const { id } = jwtService.verifyToken(refreshToken, TOKEN_TYPE.REFRESH);
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Người dùng không tồn tại.');
  }

  const accessToken = jwtService.generateToken({ id: user.id }, TOKEN_TYPE.ACCESS);
  return { accessToken };
};

export { signUp, verifyOtp, login, refreshToken };
