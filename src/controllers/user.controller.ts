import httpStatus from 'http-status';
import { Request, Response } from 'express';

import { userService } from '@/services';
import { catchAsync, response } from '@/utils';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const data = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Tạo người dùng thành công.', data));
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const { limit = 10, page = 1 } = req.query;
  const { users, totalUsers } = await userService.getUsers(+limit, +page);
  res.status(httpStatus.OK).json(
    response(httpStatus.OK, 'Lấy danh sách người dùng thành công.', {
      users,
      limit: +limit,
      currentPage: +page,
      totalPages: Math.ceil(totalUsers / +limit),
      totalUsers,
    }),
  );
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await userService.getUserById(id);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Lấy thông tin người dùng thành công.', data));
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await userService.updateUser(id, req.body);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật người dùng thành công.', data));
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await userService.deleteUser(id);
  res.status(httpStatus.NO_CONTENT).end();
});

export { createUser, getUsers, getUserById, updateUser, deleteUser };
