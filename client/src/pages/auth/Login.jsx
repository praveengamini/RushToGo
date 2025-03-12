import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        setMessage(response.data.message);
        localStorage.setItem('token', response.data.token); // Save token in localStorage
        navigate('/redirect', { state: { target: 'http://10.10.5.53:5173/' } });
      } else {
        setMessage(response.data.message);

      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">
          Login
        </button>
        {message && <p className="text-red-500 mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
