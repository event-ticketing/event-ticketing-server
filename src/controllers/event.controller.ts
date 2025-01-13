import httpStatus from 'http-status';
import { Request, Response } from 'express';

import { eventService } from '@/services';
import { catchAsync, response } from '@/utils';
import { EventConstant } from '@/constants';

const createEvent = catchAsync(async (req: Request, res: Response) => {
  const eventData = req.body;
  if (req.files) {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    eventData.logoURL = files.logoURL[0].path;
    eventData.coverURL = files.coverURL[0].path;
    eventData.organizerLogoURL = files.organizerLogoURL[0].path;
  }
  eventData.createdBy = req.user._id;
  const event = await eventService.createEvent(eventData);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Tạo sự kiện thành công.', { event }));
});

const getEvents = catchAsync(async (req: Request, res: Response) => {
  const { limit = 10, page = 1, keyword, category, status } = req.query;

  const filters: Record<string, any> = {};

  if (category && Object.values(EventConstant.EVENT_CATEGORY).includes(category as string)) {
    filters.category = category;
  }

  if (status && Object.values(EventConstant.EVENT_STATUS).includes(status as string)) {
    filters.status = status;
  }

  if (keyword) {
    filters.$or = [{ name: { $regex: keyword, $options: 'i' } }, { description: { $regex: keyword, $options: 'i' } }];
  }

  const { events, totalEvents } = await eventService.getEvents(Number(limit), Number(page), filters);
  res.status(httpStatus.OK).json(
    response(httpStatus.OK, 'Lấy danh sách sự kiện thành công.', {
      events,
      limit: Number(limit),
      currentPage: Number(page),
      totalPages: Math.ceil(totalEvents / Number(limit)),
      totalEvents,
    }),
  );
});

const getEventById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await eventService.getEventById(id);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Lấy thông tin sự kiện thành công.', { event }));
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const { id } = req.params;
  const eventData = req.body;
  if (req.files) {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    if (files.logoURL) {
      eventData.logoURL = files.logoURL[0].path;
    }
    if (files.coverURL) {
      eventData.coverURL = files.coverURL[0].path;
    }
    if (files.organizerLogoURL) {
      eventData.organizerLogoURL = files.organizerLogoURL[0].path;
    }
  }
  const event = await eventService.updateEvent(id, user, eventData);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật sự kiện thành công.', { event }));
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const { id } = req.params;
  await eventService.deleteEvent(id, user);
  res.status(httpStatus.NO_CONTENT).json(response(httpStatus.NO_CONTENT, 'Xóa sự kiện thành công.'));
});

export { createEvent, getEvents, getEventById, updateEvent, deleteEvent };
