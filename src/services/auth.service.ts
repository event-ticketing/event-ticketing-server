import httpStatus from 'http-status';

import { emailQueue } from '@/queues';
import { IUser, User } from '@/models';
import { userService, otpService } from '@/services';
import { ApiError, crypto, generateOtp } from '@/utils';

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

const login = async (identifier: string, password: string): Promise<IUser> => {
  const user = await User.findOne({ $or: [{ email: identifier }, { phoneNumber: identifier }] }).select('+password');

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Tài khoản chưa tồn tại. Vui lòng đăng ký tài khoản mới.');
  }

  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Thông tin đăng nhập không hợp lệ.');
  }

  return user;
};

export { signUp, verifyOtp, login };
