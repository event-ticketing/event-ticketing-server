import { createQueue } from '@/config/bullmq';

const notificationQueue = createQueue('notificationQueue');

const sendOrderConfirmationEmail = async (email: string, orderId: string): Promise<void> => {
  await notificationQueue.add('sendOrderConfirmation', {
    to: email,
    subject: 'Event Ticketing - Xác nhận đơn hàng',
    text: `Đơn hàng của bạn có mã số: ${orderId}`,
  });
};

const scheduleReminderEmails = async (): Promise<void> => {
  await notificationQueue.add(
    'sendReminderEmail',
    {},
    {
      repeat: {
        pattern: '0 9 * * *',
        tz: 'Asia/Bangkok',
      },
    },
  );
};

export { sendOrderConfirmationEmail, scheduleReminderEmails };
