import httpStatus from 'http-status';

import { ticketService } from '@/services';
import { catchAsync, response } from '@/utils';
import { Request, Response } from 'express';

const getTicketById = catchAsync(async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const ticket = await ticketService.getTicketById(req.user, ticketId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Lấy thông tin vé thành công.', { ticket }));
});

const generateTicketQRCode = catchAsync(async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const qrCode = await ticketService.generateTicketQRCode(req.user, ticketId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Tạo mã QR cho vé thành công.', { qrCode }));
});

const verifyTicket = catchAsync(async (req: Request, res: Response) => {
  const { qrCodeData } = req.body;
  await ticketService.verifyTicket(req.user, qrCodeData);
  return res.status(httpStatus.OK).json(response(httpStatus.OK, 'Xác thực vé thành công.'));
});

export { getTicketById, generateTicketQRCode, verifyTicket };
