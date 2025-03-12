import React, { useState } from 'react';
import axios from 'axios';

const TicketForm = () => {
  const [movieName, setMovieName] = useState('');
  const [showTime, setShowTime] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [numberOfTickets, setNumberOfTickets] = useState('');
  const [seatNumbers, setSeatNumbers] = useState([]);
  const [image, setImage] = useState(null);

  const handleNumberOfTicketsChange = (e) => {
    const numTickets = parseInt(e.target.value, 10);
    setNumberOfTickets(e.target.value);

    if (numTickets > 0) {
      const updatedSeatNumbers = Array.from({ length: numTickets }, (_, index) => seatNumbers[index] || '');
      setSeatNumbers(updatedSeatNumbers);
    } else {
      setSeatNumbers([]);
    }
  };

  const handleSeatNumberChange = (index, value) => {
    const updatedSeatNumbers = [...seatNumbers];
    updatedSeatNumbers[index] = value;
    setSeatNumbers(updatedSeatNumbers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!movieName || !showTime || !ticketPrice || !numberOfTickets || !image) {
      alert('All fields are required!');
      return;
    }
  
    const formData = new FormData();
    formData.append('movieName', movieName);
    formData.append('showTime', showTime);
    formData.append('ticketPrice', ticketPrice);
    formData.append('numberOfTickets', numberOfTickets);
    formData.append('image', image);
    formData.append('seatNumbers', JSON.stringify(seatNumbers));
  
    try {
      const response = await axios.post(
        'http://localhost:5000/api/tickets/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
  
      if (response.data.success) {
        alert('Ticket uploaded successfully!');
      } else {
        alert('Error uploading ticket: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting the form: ' + error.response?.data?.message || error.message);
    }
  };
  

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Upload Ticket</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="movieName" className="block text-gray-700 font-medium mb-2">Movie Name</label>
          <input
            id="movieName"
            type="text"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="showTime" className="block text-gray-700 font-medium mb-2">Show Time</label>
          <input
            id="showTime"
            type="datetime-local"
            value={showTime}
            onChange={(e) => setShowTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="ticketPrice" className="block text-gray-700 font-medium mb-2">Ticket Price</label>
          <input
            id="ticketPrice"
            type="number"
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="numberOfTickets" className="block text-gray-700 font-medium mb-2">Number of Tickets</label>
          <input
            id="numberOfTickets"
            type="number"
            value={numberOfTickets}
            onChange={handleNumberOfTicketsChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {seatNumbers.map((seat, index) => (
          <div key={index} className="mb-4">
            <label
              htmlFor={`seatNumber-${index}`}
              className="block text-gray-700 font-medium mb-2"
            >
              Seat Number {index + 1}
            </label>
            <input
              id={`seatNumber-${index}`}
              type="text"
              value={seat}
              onChange={(e) => handleSeatNumberChange(index, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">Image</label>
          <input
            id="image"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Upload Ticket
        </button>
      </form>
      
    </div>
  );
};

export default TicketForm;
