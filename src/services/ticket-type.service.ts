import httpStatus from 'http-status';
import { ObjectId } from 'mongoose';

import { ApiError } from '@/utils';
import { ITicketType, Show, TicketType } from '@/models';

const createTicketType = async (eventId: string, showId: string, ticketTypeData: ITicketType): Promise<ITicketType> => {
  const show = await Show.findOne({ event: eventId, _id: showId });
  if (!show) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buổi biểu diễn không tồn tại.');
  }

  const isExist = await TicketType.findOne({ show: showId, name: ticketTypeData.name });
  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Loại vé đã tồn tại.');
  }

  ticketTypeData.show = showId as unknown as ObjectId;
  const ticketType = TicketType.create(ticketTypeData);

  return ticketType;
};

const getTicketTypesOfShow = async (eventId: string, showId: string): Promise<ITicketType[]> => {
  const show = await Show.findOne({ event: eventId, _id: showId });
  if (!show) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buổi biểu diễn không tồn tại.');
  }

  const ticketTypes = await TicketType.find({ show: showId });
  if (!ticketTypes) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không có loại vé nào.');
  }

  return ticketTypes;
};

const getTicketType = async (eventId: string, showId: string, ticketTypeId: string): Promise<ITicketType> => {
  const show = await Show.findOne({ event: eventId, _id: showId });
  if (!show) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buổi biểu diễn không tồn tại.');
  }

  const ticketType = await TicketType.findOne({ show: showId, _id: ticketTypeId });
  if (!ticketType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Loại vé không tồn tại.');
  }

  return ticketType;
};

const updateTicketType = async (
  eventId: string,
  showId: string,
  ticketTypeId: string,
  ticketTypeData: ITicketType,
): Promise<ITicketType> => {
  const show = await Show.findOne({ event: eventId, _id: showId });
  if (!show) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buổi biểu diễn không tồn tại.');
  }

  const ticketType = await TicketType.findOne({ show: showId, _id: ticketTypeId });
  if (!ticketType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Loại vé không tồn tại.');
  }

  if (ticketTypeData.name && ticketTypeData.name !== ticketType.name) {
    const isExist = await TicketType.findOne({
      showId,
      name: ticketTypeData.name,
      _id: { $ne: ticketTypeId },
    });

    if (isExist) {
      throw new ApiError(httpStatus.CONFLICT, 'Loại vé đã tồn tại.');
    }
  }

  Object.assign(ticketType, ticketTypeData);
  await ticketType.save();

  return ticketType;
};

const deleteTicketType = async (eventId: string, showId: string, ticketTypeId: string): Promise<void> => {
  const show = await Show.findOne({ event: eventId, _id: showId });
  if (!show) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buổi biểu diễn không tồn tại.');
  }

  const ticketType = await TicketType.findOne({ show: showId, _id: ticketTypeId });
  if (!ticketType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Loại vé không tồn tại.');
  }

  await TicketType.deleteOne({ showId, _id: ticketTypeId });
};

export { createTicketType, getTicketTypesOfShow, getTicketType, updateTicketType, deleteTicketType };
