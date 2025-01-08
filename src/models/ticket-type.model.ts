import mongoose, { Schema, Document, Model } from 'mongoose';

import { TicketTypeConstant } from '@/constants';

export interface ITicketType extends Document {
  name: string;
  description: string;
  quantity: number;
  price: number;
  orginalPrice: number;
  isFree: boolean;
  minQtyPerOrder: number;
  maxQtyPerOrder: number;
  status: string;
  startTime: Date;
  endTime: Date;
  showId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ticketTypeSchema: Schema<ITicketType> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    orginalPrice: {
      type: Number,
      required: true,
    },
    isFree: {
      type: Boolean,
      required: true,
    },
    minQtyPerOrder: {
      type: Number,
      required: true,
      default: 1,
    },
    maxQtyPerOrder: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(TicketTypeConstant.TICKET_TYPE_STATUS),
      default: TicketTypeConstant.TICKET_TYPE_STATUS.AVAILABLE,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    showId: {
      type: Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const TicketType: Model<ITicketType> = mongoose.model('TicketType', ticketTypeSchema);

export default TicketType;
