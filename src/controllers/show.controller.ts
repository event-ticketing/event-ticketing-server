import httpStatus from 'http-status';
import { Request, Response } from 'express';

import { showService } from '@/services';
import { catchAsync, response } from '@/utils';

const createShow = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const showData = req.body;
  showData.createdBy = req.user._id;
  const show = await showService.createShow(eventId, showData);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Tạo buổi biểu diễn thành công.', { show }));
});

const getShowsOfEvent = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const shows = await showService.getShowsOfEvent(eventId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Lấy danh sách buổi biểu diễn thành công.', { shows }));
});

const getShow = catchAsync(async (req: Request, res: Response) => {
  const { eventId, showId } = req.params;
  const show = await showService.getShow(eventId, showId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Lấy thông tin buổi biểu diễn thành công.', { show }));
});

const updateShow = catchAsync(async (req: Request, res: Response) => {
  const { eventId, showId } = req.params;
  const showData = req.body;
  const show = await showService.updateShow(eventId, showId, showData);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật buổi biểu diễn thành công.', { show }));
});

const deleteShow = catchAsync(async (req: Request, res: Response) => {
  const { eventId, showId } = req.params;
  await showService.deleteShow(eventId, showId);
  res.status(httpStatus.NO_CONTENT).json(response(httpStatus.NO_CONTENT, 'Xoá buổi biểu diễn thành công.'));
});

export { createShow, getShowsOfEvent, getShow, updateShow, deleteShow };
