import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  showTime: { type: Date, required: true },
  ticketPrice: { type: Number, required: true },
  numberOfTickets: { type: Number, required: true },
  ticketsSold: { type: Number, default: 0 },
  ticketsAvailable: { type: Number, default: 0 },
  imageUrl: { type: String, required: true, unique: true }, // Cloudinary URL
  seatNumbers: { 
    type: [String], // Array of strings representing seat numbers (e.g., 'A1', 'B2')
    required: true,
    validate: {
      validator: function(val) {
        // Optional validation to ensure each seat number is unique
        return new Set(val).size === val.length;
      },
      message: 'Seat numbers must be unique'
    }
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
