import mongoose, { Schema, Document, Model } from 'mongoose';

import { EventConstant } from '@/constants';

export interface IEvent extends Document {
  name: string;
  logoURL: string;
  coverURL: string;
  venue: string;
  address: string;
  category: string;
  description?: string;
  status: string;
  startTime: Date;
  endTime: Date;
  url: string;
  organizerName: string;
  organizerLogoURL: string;
  organizerDescription: string;
  organizerAccountId: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema: Schema<IEvent> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logoURL: {
      type: String,
      required: true,
      trim: true,
    },
    coverURL: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(EventConstant.EVENT_CATEGORY),
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(EventConstant.EVENT_STATUS),
      default: EventConstant.EVENT_STATUS.UPCOMING,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    organizerName: {
      type: String,
      required: true,
      trim: true,
    },
    organizerLogoURL: {
      type: String,
      required: true,
      trim: true,
    },
    organizerDescription: {
      type: String,
      required: true,
      trim: true,
    },
    organizerAccountId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const EventModel: Model<IEvent> = mongoose.model('Event', eventSchema);

export default EventModel;
