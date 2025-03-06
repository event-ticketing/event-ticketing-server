import joi from 'joi';

import { objectId } from '@/validations/custom.validation';

const createShow = {
  params: joi.object().keys({
    eventId: joi.string().custom(objectId),
  }),
  body: joi.object().keys({
    startTime: joi.date().required(),
    endTime: joi.date().required().greater(joi.ref('startTime')),
  }),
};

const getShowsOfEvent = {
  params: joi.object().keys({
    eventId: joi.string().custom(objectId),
  }),
};

const getShow = {
  params: joi.object().keys({
    eventId: joi.string().custom(objectId),
    showId: joi.string().custom(objectId),
  }),
};

const updateShow = {
  params: joi.object().keys({
    eventId: joi.string().custom(objectId),
    showId: joi.string().custom(objectId),
  }),
  body: joi.object().keys({
    startTime: joi.date(),
    endTime: joi.date().greater(joi.ref('startTime')),
  }),
};

const deleteShow = {
  params: joi.object().keys({
    eventId: joi.string().custom(objectId),
    showId: joi.string().custom(objectId),
  }),
};

export { createShow, getShowsOfEvent, getShow, updateShow, deleteShow };
