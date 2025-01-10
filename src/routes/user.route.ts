import express from 'express';

import { UserConstant } from '@/constants';
import { userValidation } from '@/validations';
import { userController } from '@/controllers';
import { auth, author, upload, validate } from '@/middlewares';

const userRoute = express.Router();

userRoute.use(auth);

userRoute.get('/me', userController.getLoggedInUser);

userRoute.put('/me', upload('avatar'), validate(userValidation.updateProfile), userController.updateProfile);

userRoute.use(author([UserConstant.USER_ROLE.ADMIN]));

userRoute.post('/', validate(userValidation.createUser), userController.createUser);

userRoute.get('/', validate(userValidation.getUsers), userController.getUsers);

userRoute.get('/:id', validate(userValidation.getUserById), userController.getUserById);

userRoute.put('/:id', validate(userValidation.updateUser), userController.updateUser);

userRoute.delete('/:id', validate(userValidation.deleteUser), userController.deleteUser);

export default userRoute;
