import joi from 'joi';

import { objectId } from '@/validations/custom.validation';
import { TicketTypeConstant } from '@/constants';

const createTicketType = {
  params: joi.object().keys({
    eventId: joi.string().custom(objectId),
    showId: joi.string().custom(objectId),
  }),
  body: joi.object().keys({
    name: joi.string().required(),
    description: joi.string().optional().allow(''),
    quantity: joi.number().min(0).required(),
    price: joi.number().required(),
    originalPrice: joi.number().required(),
    isFree: joi.boolean().required(),
    minQtyPerOrder: joi.number().min(1).required(),
    maxQtyPerOrder: joi.number().min(joi.ref('minQtyPerOrder')).required(),
    status: joi
      .string()
      .valid(...Object.values(TicketTypeConstant.TICKET_TYPE_STATUS))
      .default(TicketTypeConstant.TICKET_TYPE_STATUS.AVAILABLE)
      .optional(),
    startTime: joi.date().required(),
    endTime: joi.date().greater(joi.ref('startTime')).required(),
  }),
};

const getTicketTypesOfShow = {
  params: joi.object().keys({
    eventId: joi.string().custom(objectId),
    showId: joi.string().custom(objectId),
  }),
};

const getTicketType = {
  params: joi.object().keys({
    eventId: joi.string().custom(objectId),
    showId: joi.string().custom(objectId),
    ticketTypeId: joi.string().custom(objectId),
  }),
};

const updateTicketType = {
  params: joi.object().keys({
    eventId: joi.string().custom(objectId),
    showId: joi.string().custom(objectId),
    ticketTypeId: joi.string().custom(objectId),
  }),
  body: joi.object().keys({
    name: joi.string(),
    description: joi.string(),
    quantity: joi.number().min(0),
    price: joi.number(),
    originalPrice: joi.number(),
    isFree: joi.boolean(),
    minQtyPerOrder: joi.number().min(1),
    maxQtyPerOrder: joi.number().min(joi.ref('minQtyPerOrder')),
    status: joi.string().valid(...Object.values(TicketTypeConstant.TICKET_TYPE_STATUS)),
    startTime: joi.date(),
    endTime: joi.date().greater(joi.ref('startTime')),
  }),
};

const deleteTicketType = {
  params: joi.object().keys({
    eventId: joi.string().custom(objectId),
    showId: joi.string().custom(objectId),
    ticketTypeId: joi.string().custom(objectId),
  }),
};

export { createTicketType, getTicketTypesOfShow, getTicketType, updateTicketType, deleteTicketType };
