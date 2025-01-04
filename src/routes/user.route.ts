import express from 'express';

import { userController } from '@/controllers';
import { validate } from '@/middlewares';
import { userValidation } from '@/validations';

const userRoute = express.Router();

userRoute.post('/', validate(userValidation.createUser), userController.createUser);

userRoute.get('/', validate(userValidation.getUsers), userController.getUsers);

userRoute.get('/:id', validate(userValidation.getUserById), userController.getUserById);

userRoute.put('/:id', validate(userValidation.updateUser), userController.updateUser);

userRoute.delete('/:id', validate(userValidation.deleteUser), userController.deleteUser);

export default userRoute;
