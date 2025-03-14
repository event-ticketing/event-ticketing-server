import mongoose, { Schema, Document, Model } from 'mongoose';

import { VoucherConstant } from '@/constants';

export interface IVoucher extends Document {
  name: string;
  code: string;
  voucherType: string;
  discount: number;
  maxDiscount: number;
  expiredDate: Date;
  status: string;
  isLimited: boolean;
  usageLimit: number;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const voucherSchema: Schema<IVoucher> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    voucherType: {
      type: String,
      required: true,
      enum: Object.values(VoucherConstant.VOUCHER_TYPE),
    },
    discount: {
      type: Number,
      required: true,
    },
    maxDiscount: {
      type: Number,
      required: true,
    },
    expiredDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(VoucherConstant.VOUCHER_STATUS),
      default: VoucherConstant.VOUCHER_STATUS.ACTIVE,
    },
    isLimited: {
      type: Boolean,
      required: true,
      default: false,
    },
    usageLimit: {
      type: Number,
      required: true,
      default: 0,
    },
    usageCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret, options) => {
        delete ret.id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

const Voucher: Model<IVoucher> = mongoose.model('Voucher', voucherSchema);

export default Voucher;
