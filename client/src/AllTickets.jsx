import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false); // For QR modal
  const [qrCode, setQrCode] = useState(''); // QR code image
  const [movieImages, setMovieImages] = useState({});
  const [paymentStatus, setPaymentStatus] = useState('pending'); // Payment status
  const [serverMessage, setServerMessage] = useState(''); // To store server message
  const navigate = useNavigate();

  // const API_KEY = "AIzaSyDt_raT62_4WQqKRyWX4n-Wua9n2ds3PUQ";
  // const CSE_ID = "645c252b1150d4f9c";
  useEffect(() => {
    if (isModalOpen && selectedTicket) {
      const fetchStatus = async () => {
        try {
          const response = await axios.post('http://localhost:5000/checkingstatus', { MovieName: selectedTicket.movieName, status: 'initiated' });
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching server message:', error.response ? error.response.data : error.message);
        }
      };
  
      fetchStatus();
    }
  }, [isModalOpen, selectedTicket]);
    
  

  const handleSearch = async (movieName) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1`,
        {
          params: {
            key: API_KEY,
            cx: CSE_ID,
            q: movieName,
            searchType: 'image',
            num: 1,
          },
        }
      );

      const imageUrl = response.data.items && response.data.items[0].link;
      setMovieImages((prevImages) => ({
        ...prevImages,
        [movieName]: imageUrl,
      }));
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tickets/getAll');
        if (response.data.success) {
          setTickets(response.data.tickets);
        } else {
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    tickets.forEach((ticket) => {
      if (!movieImages[ticket.movieName]) {
        handleSearch(ticket.movieName);
      }
    });
  }, [tickets, movieImages]);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setSelectedSeats([]);
    setTotalPrice(0);
    setIsModalOpen(true);
    fetchServerMessage(); // Fetch the server message when the dialog opens
  };

  const fetchServerMessage = async () => {
    try {
      const response = await axios.get('http://localhost:5000/checkingstatus');
      if (response.data.message) {
        setServerMessage(response.data.message); // Set the server message
      }
    } catch (error) {
      console.error('Error fetching server message:', error);
    }
  };

  const handleSeatSelection = (seat) => {
    setSelectedSeats((prevSeats) => {
      const updatedSeats = prevSeats.includes(seat)
        ? prevSeats.filter((s) => s !== seat)
        : [...prevSeats, seat];

      setTotalPrice(updatedSeats.length * selectedTicket.ticketPrice);
      return updatedSeats;
    });
  };

  const handleGenerateQRCode = async () => {
    if (!selectedTicket || selectedSeats.length === 0) {
      return;
    }

    const upiLink = `upi://pay?pa=praveengamini009@okaxis&pn=Praveen Gamini&am=${totalPrice*0.8}&cu=INR&tn=Movie Tickets for ${selectedTicket.movieName}`;

    try {
      const qrCodeImage = await QRCode.toDataURL(upiLink);
      setQrCode(qrCodeImage);
      setIsQRModalOpen(true);
    } catch (error) {
      console.error('Error generating QR Code:', error);
    }
  };

  const handlePaymentSuccess = async () => {
    setPaymentStatus('success'); // Set payment status to success
    await sendPaymentStatusToServer('success'); // Send success status to the server
    setIsQRModalOpen(false); // Close QR code modal
  };

  const sendPaymentStatusToServer = async (status) => {
    try {
      await axios.post('http://192.168.176.233:5000/checkingstatus', { status });
      console.log('Payment status sent to server:', status);
    } catch (error) {
      console.error('Error sending payment status:', error);
    }
  };

  const handlePurchase = () => {
    setIsModalOpen(false);
    handleGenerateQRCode(); // Show QR code modal
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">All Tickets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer ${ticket.ticketsAvailable === 0 ? 'opacity-25 cursor-not-allowed' : ''}`}
            onClick={() => handleSelectTicket(ticket)}
          >
            {ticket.ticketsAvailable === 0 && (
              <div className="bg-red-500 text-white text-center text-lg font-semibold p-2 ">Sold Out</div>
            )}
            <img
              src={movieImages[ticket.movieName] || 'defaultImage.jpg'}
              alt={ticket.movieName}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{ticket.movieName}</h3>
              <p className="text-sm text-gray-500">{new Date(ticket.showTime).toLocaleString()}</p>
              <p className="text-lg font-semibold text-gray-700">&#8377;{ticket.ticketPrice} <br></br>discounted price :&#8377;{ticket.ticketPrice*0.8}</p>
              <p className="text-sm text-gray-600">Available Tickets: {ticket.ticketsAvailable}</p>
              <p className="text-sm text-gray-600">Available Seats: {ticket.seatNumbers.join(', ')}</p>
              {/* <img src={ticket.imageUrl} alt="" /> */}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for selecting seats */}
      <Modal
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)}
  contentLabel="Select Seats"
  className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center  "
  overlayClassName="fixed inset-0 bg-black bg-opacity-50"
>
  <div className="bg-white p-6 rounded-lg w-1/2 flex flex-col ">
    <h1 className="text-4xl cursor-pointer" onClick={() => setIsModalOpen(false)}>X</h1>
    {selectedTicket && (
      <>
        {/* Display movie image */}
        <img
          src={movieImages[selectedTicket.movieName] || 'defaultImage.jpg'}
          alt={selectedTicket.movieName}
          className="w-[800px] h-96 object-cover mb-4 rounded-lg"
        />
        <h3 className="text-xl font-semibold text-gray-800">Selected Ticket Details</h3>
        <p>Movie: {selectedTicket.movieName}</p>
        <p>Show Time: {new Date(selectedTicket.showTime).toLocaleString()}</p>
        <p>Price: &#8377; {selectedTicket.ticketPrice * 0.8}</p>
        <p>Available Seats: {selectedTicket.seatNumbers.join(', ')}</p>
        <div className="">
          <h4 className="text-lg font-semibold text-gray-800">Select Seats:</h4>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {selectedTicket.seatNumbers.map((seat, index) => (
              <button
                key={index}
                onClick={() => handleSeatSelection(seat)}
                className={`py-2 px-4 rounded-full ${selectedSeats.includes(seat) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              >
                {seat}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-700">Total Price: &#8377; {totalPrice * 0.8}</p>
        <button
          onClick={handlePurchase}
          className=" bg-green-500 text-white py-2 px-4 rounded-full w-full"
        >
          Buy Tickets
        </button>
      </>
    )}
  </div>
</Modal>


      {/* Modal for QR code */}
      <Modal
        isOpen={isQRModalOpen}
        onRequestClose={() => setIsQRModalOpen(false)}
        contentLabel="QR Code"
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg w-96">
          <h1 className="text-4xl cursor-pointer" onClick={() => setIsQRModalOpen(false)}>X</h1>
          <h3 className="text-xl font-semibold text-gray-800">Scan to Pay</h3>
          {serverMessage && <p className="text-lg font-semibold text-gray-600">{serverMessage}</p>}
          {paymentStatus === 'pending' ? (
            <img src={qrCode} alt="QR Code" className="w-full mt-4" />
          ) : paymentStatus === 'success' ? (
            <div className="text-green-500 text-lg">Payment Successful!</div>
          ) : (
            <div className="text-red-500 text-lg">Payment Failed. Try Again!</div>
          )}
          {paymentStatus === 'pending' && (
            <button
              onClick={handlePaymentSuccess}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full w-full"
            >
              Payment successful
            </button>
          )}
        </div>
      </Modal>

      {/* Payment Success Modal */}
      {paymentStatus === 'success' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold text-green-500">Payment Successful!</h3>
            <button
              onClick={() => setPaymentStatus('pending')}
              className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-full w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;
