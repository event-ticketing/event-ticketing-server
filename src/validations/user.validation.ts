import joi from 'joi';

import { UserConstant } from '@/constants';
import { objectId } from '@/validations/custom.validation';

const createUser = {
  body: joi.object({
    email: joi.string().email().required(),
    phoneNumber: joi.string().required(),
    password: joi.string().required(),
    fullName: joi.string().required(),
    dateOfBirth: joi.date(),
    gender: joi.string().valid(...Object.values(UserConstant.GENDER)),
    avatar: joi.string(),
    role: joi.string().valid(...Object.values(UserConstant.USER_ROLE)),
    isVerified: joi.boolean().default(false),
  }),
};

const getUsers = {
  query: joi.object({
    limit: joi.number().default(10),
    page: joi.number().default(1),
  }),
};

const getUserById = {
  params: joi.object({
    id: joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: joi.object({
    id: joi.required().custom(objectId),
  }),
  body: joi.object({
    email: joi.string().email().required(),
    phoneNumber: joi.string().required(),
    password: joi.string().required(),
    fullName: joi.string().required(),
    dateOfBirth: joi.date(),
    gender: joi.string().valid(...Object.values(UserConstant.GENDER)),
    avatar: joi.string(),
    role: joi.string().valid(...Object.values(UserConstant.USER_ROLE)),
    isVerified: joi.boolean().default(false),
  }),
};

const deleteUser = {
  params: joi.object({
    id: joi.string().custom(objectId),
  }),
};

const updateProfile = {
  body: joi.object({
    email: joi.string().email().optional(),
    phoneNumber: joi.string().optional(),
    fullName: joi.string().optional(),
    dateOfBirth: joi.date().optional(),
    gender: joi
      .string()
      .valid(...Object.values(UserConstant.GENDER))
      .optional(),
  }),
};

export { createUser, getUsers, getUserById, updateUser, deleteUser, updateProfile };
