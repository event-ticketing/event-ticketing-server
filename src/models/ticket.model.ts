import mongoose, { Schema, Document, Model } from 'mongoose';

import { TicketConstant } from '@/constants';

export interface ITicket extends Document {
  orderId: Schema.Types.ObjectId;
  ticketTypeId: Schema.Types.ObjectId;
  purchasedDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema: Schema<ITicket> = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    ticketTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'TicketType',
      required: true,
    },
    purchasedDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TicketConstant.TICKET_STATUS),
      default: TicketConstant.TICKET_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

const Ticket: Model<ITicket> = mongoose.model('Ticket', ticketSchema);

export default Ticket;
