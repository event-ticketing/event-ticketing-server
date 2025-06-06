import joi from 'joi';

import { AuthConstant } from '@/constants';
import { password } from '@/validations/custom.validation';

const signUp = {
  body: joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().custom(password),
    repeatPassword: joi.string().valid(joi.ref('password')).messages({
      'any.only': 'Mật khẩu không khớp.',
    }),
  }),
};

const verifyOtp = {
  body: joi.object({
    email: joi.string().email().required(),
    otp: joi.string().required(),
    context: joi
      .string()
      .required()
      .valid(...Object.values(AuthConstant.OTP_CONTEXT)),
  }),
};

const login = {
  body: joi.object({
    identifier: joi.string().required(),
    password: joi.string().required(),
  }),
};

const refreshToken = {
  body: joi.object({
    refreshToken: joi.string().required(),
  }),
};

const forgotPassword = {
  body: joi.object({
    email: joi.string().email().required(),
  }),
};

const resetPassword = {
  body: joi.object({
    resetPasswordToken: joi.string().required(),
    password: joi.string().required().custom(password),
    repeatPassword: joi.string().valid(joi.ref('password')).messages({
      'any.only': 'Mật khẩu không khớp.',
    }),
  }),
};

export { signUp, verifyOtp, login, refreshToken, forgotPassword, resetPassword };
