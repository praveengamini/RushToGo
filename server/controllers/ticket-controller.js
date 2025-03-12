import Ticket from '../models/ticket.js';
import { upload, imageUploadUtil } from '../helpers/cloudinary.js';

 // Assuming this utility handles the Cloudinary upload

 export const uploadTicket = async (req, res) => {
    try {
      console.log("Request Body:", req.body); // Log request body for debugging
      console.log("Uploaded File:", req.file); // Log uploaded file details
  
      const { movieName, showTime, ticketPrice, numberOfTickets, seatNumbers } = req.body;
  
      // Validate all required fields
      if (!movieName || !showTime || !ticketPrice || !numberOfTickets || !seatNumbers) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
  
      // Validate that an image file is uploaded
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No image uploaded" });
      }
  
      // Parse and validate seat numbers
      let parsedSeatNumbers;
      try {
        parsedSeatNumbers = JSON.parse(seatNumbers);
        if (!Array.isArray(parsedSeatNumbers) || parsedSeatNumbers.length !== parseInt(numberOfTickets, 10)) {
          throw new Error("Invalid seat numbers");
        }
      } catch (error) {
        return res.status(400).json({ success: false, message: "Seat numbers must be a valid JSON array matching the number of tickets" });
      }
  
      // Upload image to Cloudinary (assuming imageUploadUtil is a valid function)
      const imageResult = await imageUploadUtil(req.file);
  
      // Create and save the new ticket in the database
      const ticket = new Ticket({
        movieName,
        showTime: new Date(showTime), // Convert showTime to Date object
        ticketPrice: parseFloat(ticketPrice), // Ensure ticketPrice is a number
        numberOfTickets: parseInt(numberOfTickets, 10), // Ensure numberOfTickets is a number
        ticketsAvailable: parseInt(numberOfTickets, 10), // Initialize ticketsAvailable
        imageUrl: imageResult.secure_url, // Cloudinary image URL
        seatNumbers: parsedSeatNumbers, // Use validated seat numbers
      });
  
      await ticket.save();
  
      // Send a success response
      res.status(201).json({
        success: true,
        message: "Ticket uploaded successfully",
        ticket,
      });
    } catch (error) {
      console.error("Error uploading ticket:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  

// Get All Tickets
export const getAllTickets = async (req, res) => {
    try {
      // Fetching all tickets from the database
      const tickets = await Ticket.find();
      console.log(tickets);
  
      // If no tickets are found, return a 404 error
      if (!tickets.length) {
        return res.status(404).json({ success: false, message: 'No tickets found' });
      }
  
      // If tickets are found, return them in a formatted response
      res.status(200).json({
        success: true,
        tickets: tickets.map(ticket => ({
          movieName: ticket.movieName,
          showTime: ticket.showTime,
          ticketPrice: ticket.ticketPrice,
          numberOfTickets: ticket.numberOfTickets,
          ticketsSold: ticket.ticketsSold,
          ticketsAvailable: ticket.ticketsAvailable,
          imageUrl: ticket.imageUrl, // Cloudinary image URL
          seatNumbers: ticket.seatNumbers, // Include seat numbers  
        }))
      });
    } catch (err) {
      // Log the error and send a 500 error response if something goes wrong
      console.error("Error fetching tickets:", err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  
export const purchaseTicket = async (req, res) => {
  try {
    const { movieName, numberOfTickets, seatNumbers, userInfo } = req.body;

    // Validate that the correct number of tickets and seat numbers are provided
    if (!Array.isArray(seatNumbers) || seatNumbers.length !== parseInt(numberOfTickets)) {
      return res.status(400).json({ success: false, message: 'Invalid seat numbers or number of tickets' });
    }

    // Find the ticket details
    const ticket = await Ticket.findOne({ movieName });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check if enough tickets are available
    if (ticket.ticketsAvailable < numberOfTickets) {
      return res.status(400).json({ success: false, message: 'Not enough tickets available' });
    }

    // Check if the selected seats are available
    const unavailableSeats = seatNumbers.filter(seat => ticket.seatNumbers.includes(seat));

    if (unavailableSeats.length > 0) {
      return res.status(400).json({ success: false, message: `Seats ${unavailableSeats.join(', ')} are already taken` });
    }

    // Update the ticket data
    ticket.seatNumbers = [...ticket.seatNumbers, ...seatNumbers];
    ticket.ticketsAvailable -= numberOfTickets;
    ticket.ticketsSold += numberOfTickets;

    await ticket.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Ticket purchase successful',
      purchasedSeats: seatNumbers,
      userInfo,
    });
  } catch (error) {
    console.error('Error purchasing ticket:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

