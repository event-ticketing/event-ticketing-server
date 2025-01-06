import express from 'express';

import { validate } from '@/middlewares';
import { authController } from '@/controllers';
import { authValidation } from '@/validations';

const authRoute = express.Router();

authRoute.post('/sign-up', validate(authValidation.signUp), authController.signUp);

authRoute.post('/verify-otp', validate(authValidation.verifyOtp), authController.verifyOtp);

authRoute.post('/login', validate(authValidation.login), authController.login);

authRoute.post('/refresh-token', validate(authValidation.refreshToken), authController.refreshToken);

export default authRoute;
