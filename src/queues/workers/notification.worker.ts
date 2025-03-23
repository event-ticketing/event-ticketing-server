import nodemailer from 'nodemailer';

import env from '@/config/env';
import logger from '@/config/logger';
import { timeConverter } from '@/utils';
import { createWorker } from '@/config/bullmq';
import { OrderConstant, TicketConstant } from '@/constants';
import { IEvent, IUser, Order, Show, Ticket, TicketType } from '@/models';

const transporter = nodemailer.createTransport({
  host: env.email.host,
  port: env.email.port,
  auth: {
    user: env.email.user,
    pass: env.email.pass,
  },
});

const notificationWorker = createWorker('notificationQueue', async (job: any) => {
  switch (job.name) {
    case 'sendOrderConfirmation':
      return await sendOrderConfirmation(job.data);
    case 'sendReminderEmail':
      return await sendReminderEmails();
    default:
      throw new Error('Invalid job name');
  }
});

const sendOrderConfirmation = async (data: any): Promise<void> => {
  const { to, subject, text } = data;
  try {
    await transporter.sendMail({ from: env.email.user, to, subject, text });
    logger.info(`Order confirmation email sent to ${to}`);
  } catch (error: any) {
    logger.error(`Error sending order confirmation email to ${to}: ${error.message}`);
    throw error;
  }
};

const sendReminderEmails = async (): Promise<void> => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const endOfTomorrow = new Date(tomorrow.getTime());
  endOfTomorrow.setHours(23, 59, 59, 999);

  const shows = await Show.find({
    startTime: { $gte: tomorrow, $lte: endOfTomorrow },
  })
    .populate('event')
    .populate('ticketTypes');

  if (!shows.length) return;

  const showIds = shows.map((show) => show._id);

  const ticketTypes = await TicketType.find({ show: { $in: showIds } }, { _id: 1, show: 1 });
  const ticketTypeIds = ticketTypes.map((ticketType) => ticketType._id);
  const tickets = await Ticket.find(
    { ticketType: { $in: ticketTypeIds }, status: TicketConstant.TICKET_STATUS.SUCCESS },
    { ticketType: 1, order: 1 },
  ).lean();

  const orderIds = [...new Set(tickets.map((ticket) => String(ticket.order)))];

  const orders = await Order.find({
    _id: { $in: orderIds },
    status: OrderConstant.ORDER_STATUS.COMPLETED,
  }).populate('user', 'fullName email');

  if (!orders.length) return;

  const ticketsByOrder = tickets.reduce((acc: any, ticket) => {
    const orderId = String(ticket.order);
    if (!acc[orderId]) acc[orderId] = [];
    acc[orderId].push(ticket);
    return acc;
  }, {});

  const userEventMap = new Map();

  for (const order of orders) {
    const user = order.user as unknown as IUser;

    if (!user) continue;

    const userTickets = ticketsByOrder[String(order._id)] || [];
    const userTicketTypeIds = [...new Set(userTickets.map((ticket: any) => String(ticket.ticketType)))];

    const userShows = shows.filter((show) =>
      show.ticketTypes.some((ticketTypes) => userTicketTypeIds.includes(String(ticketTypes._id))),
    );

    for (const show of userShows) {
      const event = show.event as unknown as IEvent;
      const key = `${user._id}-${event._id}`;

      if (!userEventMap.has(key)) {
        userEventMap.set(key, {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
          },
          event: {
            id: event._id,
            name: event.name,
            image: event.coverURL,
          },
          shows: [],
        });
      }

      const existingShowIds = userEventMap.get(key).shows.map((show: any) => show.id);
      if (!existingShowIds.includes(show._id)) {
        userEventMap.get(key).shows.push({
          id: event._id,
          name: event.name,
          date: show.startTime,
        });
      }
    }
  }

  const reminderData = Array.from(userEventMap.values());

  for (const data of reminderData) {
    const { user, event, shows } = data;
    const showDates = shows.map((show: any) => timeConverter.isoToGMT7(show.date)).join(', ');

    const subject = `Event Ticketing - Nhắc nhở sự kiện`;
    const text = `Chào ${user.fullName},\n\nBạn đã đặt vé cho các sự kiện sau: ${showDates}. Hãy chắc chắn bạn sẽ tham gia đúng giờ.\n\nTrân trọng,\nEvent Ticketing`;

    try {
      await transporter.sendMail({ from: env.email.user, to: user.email, subject, text });
      logger.info(`Reminder email sent to ${user.email}`);
    } catch (error: any) {
      logger.error(`Error sending reminder email to ${user.email}: ${error.message}`);
      throw error;
    }
  }
};

export default notificationWorker;
