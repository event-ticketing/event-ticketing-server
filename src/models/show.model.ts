import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShow extends Document {
  name: string;
  event: Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const showSchema: Schema<IShow> = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    event: {
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

showSchema.pre('save', async function (next) {
  const show = this as IShow;

  if (show.isModified('startTime') || show.isModified('endTime')) {
    const gmtStartTime = new Date(show.startTime).getTime();
    const gmtEndTime = new Date(show.endTime).getTime();
    show.name = `${new Date(gmtStartTime).toLocaleString()} - ${new Date(gmtEndTime).toLocaleString()}`;
  }

  next();
});

showSchema.virtual('ticketTypes', {
  ref: 'TicketType',
  localField: '_id',
  foreignField: 'showId',
});

const Show: Model<IShow> = mongoose.model('Show', showSchema);

export default Show;
