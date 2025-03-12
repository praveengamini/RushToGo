import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users.js';

// Register User
export const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ userName, email, password: hashedPassword });
    await user.save();

    res.json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    res.json({ success: false, message: 'Internal server error' });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Please register first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {   
      return res.json({ success: false, message: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
    res.json({ success: true, message: 'User logged in successfully', token });
  } catch (err) {
    res.json({ success: false, message: 'Internal server error' });
  }
};
