import { EventConstant } from '@/constants';
import joi from 'joi';
import { objectId } from './custom.validation';

const createEvent = {
  body: joi.object({
    name: joi.string().required(),
    logoURL: joi.string().required(),
    coverURL: joi.string().required(),
    venue: joi.string().required(),
    address: joi.string().required(),
    category: joi
      .string()
      .valid(...Object.values(EventConstant.EVENT_CATEGORY))
      .required(),
    description: joi.string().required(),
    organizerName: joi.string().required(),
    organizerLogoURL: joi.string().required(),
    organizerDescription: joi.string().required(),
  }),
};

const getEvents = {
  query: joi.object({
    limit: joi.number().default(10),
    page: joi.number().default(1),
    keyword: joi.string().allow(null, ''),
    category: joi
      .string()
      .valid(...Object.values(EventConstant.EVENT_CATEGORY))
      .allow(null, ''),
    status: joi
      .string()
      .valid(...Object.values(EventConstant.EVENT_STATUS))
      .allow(null, ''),
  }),
};

const getEventById = {
  params: joi.object({
    id: joi.string().custom(objectId),
  }),
};

const updateEvent = {
  body: joi.object({
    name: joi.string().optional(),
    logoURL: joi.string().optional(),
    coverURL: joi.string().optional(),
    venue: joi.string().optional(),
    address: joi.string().optional(),
    category: joi
      .string()
      .valid(...Object.values(EventConstant.EVENT_CATEGORY))
      .optional(),
    description: joi.string().optional(),
    organizerName: joi.string().optional(),
    organizerLogoURL: joi.string().optional(),
    organizerDescription: joi.string().optional(),
  }),
};

const deleteEvent = {
  params: joi.object({
    id: joi.string().custom(objectId),
  }),
};

export { createEvent, getEvents, getEventById, updateEvent, deleteEvent };
