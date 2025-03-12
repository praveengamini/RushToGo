import mongoose from 'mongoose';

const ticketsSoldSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  ticketsSold: { type: Number, required: true },
  soldDate: { type: Date, default: Date.now },
});

const TicketsSold = mongoose.model('TicketsSold', ticketsSoldSchema);
export default TicketsSold;
