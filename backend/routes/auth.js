const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user.model');

//Register User
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    //validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    //Check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration: ' + err.message });
  }
});

//Login User
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    //Basic validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }

    //Check for user existence
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    //Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    //Generate JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1y' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
      },
      message: 'Logged in successfully!',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login: ' + err.message });
  }
});

module.exports = router;
