import { ObjectId } from 'mongoose';
import httpStatus from 'http-status';

import { ApiError } from '@/utils';
import { Event, IShow, Show } from '@/models';

const createShow = async (eventId: string, showData: IShow): Promise<IShow> => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sự kiện không tồn tại.');
  }

  const isExist = await Show.findOne({ eventId, startTime: showData.startTime, endTime: showData.endTime });
  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Buổi biểu diễn đã tồn tại.');
  }

  showData.eventId = eventId as unknown as ObjectId;
  const show = await Show.create(showData);
  return show;
};

const getShowsOfEvent = async (eventId: string): Promise<IShow[]> => {
  const event = Event.findById(eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sự kiện không tồn tại.');
  }

  const shows = await Show.find({ eventId }).populate('ticketTypes').lean();
  if (!shows) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không có buổi biểu diễn nào.');
  }
  return shows;
};

const getShow = async (eventId: string, showId: string): Promise<IShow> => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sự kiện không tồn tại.');
  }

  const show = await Show.findOne({ eventId, _id: showId }).populate('ticketTypes').lean();
  if (!show) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buổi biểu diễn không tồn tại.');
  }

  return show;
};

const updateShow = async (eventId: string, showId: string, showData: IShow): Promise<IShow> => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sự kiện không tồn tại.');
  }

  const show = await Show.findOne({ eventId, _id: showId }).populate('ticketTypes').lean();
  if (!show) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buổi biểu diễn không tồn tại.');
  }

  if (showData.startTime) {
    show.startTime = showData.startTime;
  }

  if (showData.endTime) {
    show.endTime = showData.endTime;
  }

  await show.save();

  return show;
};

const deleteShow = async (eventId: string, showId: string): Promise<void> => {
  const show = await Show.findOne({ eventId, _id: showId });
  if (!show) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buổi biểu diễn không tồn tại.');
  }

  await Show.deleteOne({ eventId, _id: showId });
};

export { createShow, getShowsOfEvent, getShow, updateShow, deleteShow };
