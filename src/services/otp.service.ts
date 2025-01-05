import { crypto, generateOtp } from '@/utils';
import redisClient from '@/config/redis';
import { AuthConstant } from '@/constants';

const saveOtp = async (key: string, encryptedOtp: string): Promise<void> => {
  await redisClient.set(key, encryptedOtp, 'EX', AuthConstant.OTP_EXPIRY_TIME);
};

const verifyOtp = async (key: string, otp: string): Promise<boolean> => {
  const encryptedOtp = await redisClient.get(key);
  if (!encryptedOtp || crypto.decrypt(encryptedOtp) !== otp) return false;
  await redisClient.del(key);
  return true;
};

export { saveOtp, verifyOtp };
