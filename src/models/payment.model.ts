import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
  _id: Schema.Types.ObjectId;
  owner: string;
  accountNumber: string;
  bank: string;
  branch?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema: Schema<IPayment> = new Schema(
  {
    owner: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    bank: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Payment: Model<IPayment> = mongoose.model('Payment', paymentSchema);

export default Payment;
