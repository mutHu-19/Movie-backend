const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Configuration
const SALT_ROUNDS = 10;
const JWT_CONFIG = { expiresIn: '7d' };

// Helper functions
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, JWT_CONFIG);

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Check for existing user
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, SALT_ROUNDS)
    });

    // Return response
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = {
  register: registerUser,
  login: loginUser
};

// Get current user (protected route)
exports.getProfile = async (req, res) => {
  res.json(req.user);
};


// Save favourite movie
exports.saveFavourite = (req, res) => {
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
  exports.getFavourites = (req, res) => {
    const { username } = req.params;
    const favorites = readFavourites();
    res.json(favorites[username] || []);
  };
  
  // Remove a favourite
  exports.deleteFavourites = (req, res) => {
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