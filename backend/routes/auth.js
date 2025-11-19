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

    const now = Date.now();
    const last = user.lastLogin ? user.lastLogin.getTime() : null;

    const ONE_DAY = 24 * 60 * 60 * 1000;

    if (!last) {
      user.streak = 1;
    }
    else {
      const diff = now - last;

      if (diff < ONE_DAY) {

      }
      else if (diff < ONE_DAY * 2) {
        user.streak += 1;
      }
      else {
        user.streak += 1;
      }
    }

    user.lastLogin = now;
    await user.save();

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
        streak: user.streak,
      },
      message: 'Logged in successfully!',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login: ' + err.message });
  }
});

router.get("/streak", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth)
      return res.status(401).json({ message: "No token provided" });

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    return res.json({ streak: user.streak });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
