import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShow extends Document {
  name: string;
  eventId: Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const showSchema: Schema<IShow> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Show: Model<IShow> = mongoose.model('Show', showSchema);

export default Show;
