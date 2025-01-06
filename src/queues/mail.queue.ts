import { createQueue } from '@/config/bullmq';

const emailQueue = createQueue('emailQueue');

const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
  await emailQueue.add('sendOtp', {
    to: email,
    subject: 'Event Ticketing - Xác thực OTP',
    text: `Mã OTP của bạn là: ${otp}`,
  });
};

export { sendOtpEmail };
