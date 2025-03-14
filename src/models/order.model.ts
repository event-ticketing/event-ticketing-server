import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  userId: Schema.Types.ObjectId;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
  voucherId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema: Schema<IOrder> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    voucherId: {
      type: Schema.Types.ObjectId,
      ref: 'Voucher',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret, options) => {
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

orderSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

orderSchema.virtual('voucher', {
  ref: 'Voucher',
  localField: 'voucherId',
  foreignField: '_id',
  justOne: true,
});

const Order: Model<IOrder> = mongoose.model('Order', orderSchema);

export default Order;
