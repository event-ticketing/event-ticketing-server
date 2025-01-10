import httpStatus from 'http-status';

import { ApiError } from '@/utils';
import { User, IUser } from '@/models';

const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const { email, phoneNumber } = userData;

  const isExist = await User.findOne({ $or: [{ email }, { phoneNumber }] });

  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Email hoặc số điện thoại đã tồn tại.');
  }

  const user = await User.create(userData);

  return user;
};

const getUsers = async (limit: number, page: number): Promise<{ users: IUser[]; totalUsers: number }> => {
  const skip = (page - 1) * limit;
  const query = {};

  const [users, totalUsers] = await Promise.all([User.find(query).limit(limit).skip(skip), User.countDocuments(query)]);

  return { users, totalUsers };
};

const getUserById = async (id: string): Promise<IUser> => {
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại.');
  }

  return user;
};

const updateUser = async (id: string, updateBody: Partial<IUser>): Promise<IUser> => {
  const user = await getUserById(id);

  if (updateBody.email && user.email !== updateBody.email) {
    const isExist = await User.findOne({
      email: updateBody.email,
      _id: { $ne: id },
    });

    if (isExist) {
      throw new ApiError(httpStatus.CONFLICT, 'Email đã tồn tại.');
    }

    user.email = updateBody.email;
  }

  Object.assign(user, updateBody);
  await user.save();

  return user;
};

const deleteUser = async (id: string): Promise<void> => {
  const user = await getUserById(id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại.');
  }

  await User.deleteOne({ _id: id });
};

const updateProfile = async (id: string, updateBody: Partial<IUser>): Promise<IUser> => {
  const user = await getUserById(id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại.');
  }

  if (updateBody.email && user.email !== updateBody.email) {
    const isExist = await User.findOne({ email: updateBody.email, _id: { $ne: id } });

    if (isExist) {
      throw new ApiError(httpStatus.CONFLICT, 'Email đã tồn tại.');
    }
  }

  Object.assign(user, updateBody);

  await user.save();

  return user;
};

export { createUser, getUsers, getUserById, updateUser, deleteUser, updateProfile };
