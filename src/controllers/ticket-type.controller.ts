import httpStatus from 'http-status';
import { Request, Response } from 'express';

import { catchAsync, response } from '@/utils';
import { ticketTypeService } from '@/services';

const createTicketType = catchAsync(async (req: Request, res: Response) => {
  const { eventId, showId } = req.params;
  const ticketTypeData = req.body;
  const ticketType = await ticketTypeService.createTicketType(eventId, showId, ticketTypeData);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Tạo loại vé thành công.', { ticketType }));
});

const getTicketTypesOfShow = catchAsync(async (req: Request, res: Response) => {
  const { eventId, showId } = req.params;
  const ticketTypes = await ticketTypeService.getTicketTypesOfShow(eventId, showId);
  res
    .status(httpStatus.OK)
    .json(response(httpStatus.OK, 'Lấy thông tin các loại vé của buổi biểu diễn thành công.', { ticketTypes }));
});

const getTicketType = catchAsync(async (req: Request, res: Response) => {
  const { eventId, showId, ticketTypeId } = req.params;
  const ticketType = await ticketTypeService.getTicketType(eventId, showId, ticketTypeId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Lấy thông tin loại vé thành công.', { ticketType }));
});

const updateTicketType = catchAsync(async (req: Request, res: Response) => {
  const { eventId, showId, ticketTypeId } = req.params;
  const ticketTypeData = req.body;
  const ticketType = await ticketTypeService.updateTicketType(eventId, showId, ticketTypeId, ticketTypeData);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật thông tin loại vé thành công.', { ticketType }));
});

const deleteTicketType = catchAsync(async (req: Request, res: Response) => {
  const { eventId, showId, ticketTypeId } = req.params;
  await ticketTypeService.deleteTicketType(eventId, showId, ticketTypeId);
  res.status(httpStatus.NO_CONTENT).json(response(httpStatus.NO_CONTENT, 'Xóa loại vé thành công.'));
});

export { createTicketType, getTicketTypesOfShow, getTicketType, updateTicketType, deleteTicketType };
