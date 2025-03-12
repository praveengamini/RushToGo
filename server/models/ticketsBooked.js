import mongoose from 'mongoose';

const ticketsBookedSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookedTickets: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
});

const TicketsBooked = mongoose.model('TicketsBooked', ticketsBookedSchema);
export default TicketsBooked;
