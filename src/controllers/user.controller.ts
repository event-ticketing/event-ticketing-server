import httpStatus from 'http-status';
import { Request, Response } from 'express';

import { userService } from '@/services';
import { catchAsync, response } from '@/utils';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Tạo người dùng thành công.', { user }));
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const { limit = 10, page = 1 } = req.query;
  const { users, totalUsers } = await userService.getUsers(Number(limit), Number(page));
  res.status(httpStatus.OK).json(
    response(httpStatus.OK, 'Lấy danh sách người dùng thành công.', {
      users,
      limit: Number(limit),
      currentPage: Number(page),
      totalPages: Math.ceil(totalUsers / Number(limit)),
      totalUsers,
    }),
  );
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Lấy thông tin người dùng thành công.', { user }));
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.updateUser(id, req.body);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật người dùng thành công.', { user }));
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await userService.deleteUser(id);
  res.status(httpStatus.NO_CONTENT).end();
});

const getLoggedInUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.user.id);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Lấy thông tin người dùng thành công.', { user }));
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const updatedData = req.body;
  if (req.file) {
    updatedData.avatar = req.file.path;
  }
  const user = await userService.updateProfile(req.user.id, updatedData);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật thông tin thành công.', { user }));
});

export { createUser, getUsers, getUserById, updateUser, deleteUser, getLoggedInUser, updateProfile };
