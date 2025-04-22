import joi from 'joi';

import { objectId } from '@/validations/custom.validation';

const getTicketById = {
  params: joi.object({
    ticketId: joi.string().custom(objectId).required(),
  }),
};

const generateTicketQRCode = {
  params: joi.object({
    ticketId: joi.string().custom(objectId).required(),
  }),
};

const verifyTicket = {
  body: joi.object({
    qrCodeData: joi.string().required(),
  }),
};

export { getTicketById, generateTicketQRCode, verifyTicket };
