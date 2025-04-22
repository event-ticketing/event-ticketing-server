import httpStatus from 'http-status';

import { ApiError, generateQRCode } from '@/utils';
import { TicketConstant, UserConstant } from '@/constants';
import { IEvent, IOrder, IShow, ITicket, ITicketType, IUser, Order, Ticket } from '@/models';

const findTicketById = async (
  ticketId: string,
  populateOptions: any = {},
  lean: boolean = true,
): Promise<ITicket | null> => {
  const query = Ticket.findOne({ _id: ticketId }).populate(populateOptions);
  return lean ? query.lean() : query;
};

const checkTicketPermission = async (user: IUser, ticket: ITicket): Promise<boolean> => {
  const isAdmin = user?.role === UserConstant.USER_ROLE.ADMIN || false;
  const order = await Order.findById(ticket?.order);
  const isTicketOwner = !!(order?.user && order?.user.toString() === user._id.toString());
  return isAdmin || isTicketOwner;
};

const checkTicketEventCreatorPermission = (user: IUser, ticket: ITicket): boolean => {
  const isAdmin = user?.role === UserConstant.USER_ROLE.ADMIN;
  const ticketType = ticket.ticketType as unknown as ITicketType;
  const show = ticketType?.show as unknown as IShow;
  const event = show?.event as unknown as IEvent;
  const isEventCreator = event?.createdBy && event.createdBy.toString() === user._id.toString();
  return isAdmin || isEventCreator;
};

const getTicketById = async (user: IUser, ticketId: string): Promise<ITicket> => {
  const ticket = await findTicketById(ticketId, 'ticketType');
  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vé không tồn tại');
  }

  const hasPermission = await checkTicketPermission(user, ticket);
  if (!hasPermission) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền xem vé này');
  }

  return ticket;
};

const generateTicketQRCode = async (user: IUser, ticketId: string): Promise<string> => {
  const ticket = await findTicketById(ticketId, {
    path: 'order',
    select: 'user',
  });
  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vé không tồn tại');
  }

  const hasPermission = await checkTicketPermission(user, ticket);
  if (!hasPermission) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền tạo mã QR cho vé này');
  }

  const ticketData = {
    id: ticket._id,
    timestamp: Date.now(),
  };

  return generateQRCode(JSON.stringify(ticketData));
};

const validateQrCodeData = (qrCodeData: string): { id: string; timestamp: number } => {
  try {
    const ticketData = JSON.parse(qrCodeData);
    if (!ticketData || !ticketData.id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'QR code không hợp lệ hoặc thiếu thông tin');
    }

    const qrTimestamp = ticketData.timestamp || 0;
    const currentTime = Date.now();
    const maxQrAgeMs = 1000 * 60 * 60;

    if (currentTime - qrTimestamp > maxQrAgeMs) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'QR code đã hết hạn. Vui lòng tạo mã mới.');
    }

    return ticketData;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.BAD_REQUEST, 'QR code không hợp lệ');
  }
};
const verifyTicket = async (user: IUser, qrCodeData: string): Promise<void> => {
  const { id: ticketId } = validateQrCodeData(qrCodeData);

  const ticket = await findTicketById(
    ticketId,
    {
      path: 'ticketType',
      select: 'show',
      populate: {
        path: 'show',
        select: 'event',
        populate: {
          path: 'event',
          select: 'createdBy',
        },
      },
    },
    false,
  );
  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vé không tồn tại');
  }

  const hasPermission = checkTicketEventCreatorPermission(user, ticket);
  if (!hasPermission) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền xác thực vé này');
  }

  const invalidStatusMessages = {
    [TicketConstant.TICKET_STATUS.USED]: 'Vé đã được sử dụng',
    [TicketConstant.TICKET_STATUS.CANCELLED]: 'Vé đã bị hủy',
    [TicketConstant.TICKET_STATUS.PENDING]: 'Vé chưa được thanh toán',
    [TicketConstant.TICKET_STATUS.REJECTED]: 'Vé đã bị từ chối',
  };
  const errorMessage = invalidStatusMessages[ticket.status];
  if (errorMessage) {
    throw new ApiError(httpStatus.BAD_REQUEST, errorMessage);
  }

  ticket.status = TicketConstant.TICKET_STATUS.USED;
  await ticket.save();
};

export { getTicketById, generateTicketQRCode, verifyTicket };
