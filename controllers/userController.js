const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Configuration
const SALT_ROUNDS = 10;
const JWT_CONFIG = { expiresIn: '7d' };

// Helper functions
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, JWT_CONFIG);

const registerUser = async (req, res) => {
  console.time('Registration Time');
  const { username, email, password } = req.body;

  try {
    console.time('User Exists Check');
    const userExists = await User.findOne({ email }).lean();
    console.timeEnd('User Exists Check');

    if (userExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    console.time('Password Hashing');
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    console.timeEnd('Password Hashing');

    console.time('User Creation');
    const user = await User.create({ username, email, password: hashedPassword });
    console.timeEnd('User Creation');

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  } finally {
    console.timeEnd('Registration Time');
  }
};
// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user (protected route)
const getProfile = async (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email
  });
};

// Save favourite movie
const saveFavourite = (req, res) => {
  const { username } = req.params;
  const movie = req.body;

  const favorites = readFavourites();

  if (!favorites[username]) {
    favorites[username] = [];
  }

  const alreadyExists = favorites[username].some(m => m.id === movie.id);

  if (alreadyExists) {
    return res.status(400).json({ message: 'Movie already in favorites' });
  }

  favorites[username].push(movie);
  writeFavourites(favorites);

  res.json({ message: 'Movie added to favorites' });
};

// Get favourite movies
const getFavourites = (req, res) => {
  const { username } = req.params;
  const favorites = readFavourites();
  res.json(favorites[username] || []);
};

// Remove a favourite
const deleteFavourites = (req, res) => {
  const { username, id } = req.params;
  const favorites = readFavourites();

  if (!favorites[username]) {
    return res.status(404).json({
      message: `No favorites found for user ${username}`
    });
  }

  favorites[username] = favorites[username].filter(movie => movie.id !== parseInt(id));
  writeFavourites(favorites);

  res.json({
    message: 'Movie removed from favorites'
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  saveFavourite,
  getFavourites,
  deleteFavourites
};