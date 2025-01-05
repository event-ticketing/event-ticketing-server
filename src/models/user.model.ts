import bcrypt from 'bcrypt';
import mongoose, { Schema, Document, Model } from 'mongoose';

import { UserConstant } from '@/constants';

export interface IUser extends Document {
  email: string;
  phoneNumber?: string;
  password: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  avatar?: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  isPasswordMatch(password: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    fullName: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: Object.values(UserConstant.GENDER),
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(UserConstant.USER_ROLE),
      default: UserConstant.USER_ROLE.USER,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre<IUser>('save', async function (next) {
  const user = this as IUser;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, UserConstant.SALT_WORK_FACTOR);
  }

  next();
});

userSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  const user = this as IUser;
  return await bcrypt.compare(password, user.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
