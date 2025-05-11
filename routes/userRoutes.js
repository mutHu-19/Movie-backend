const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  saveFavourite,
  getFavourites,
  deleteFavourites
} = require('../controllers/userController');

// Auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);

// Favorites
router.post('/:username/favorites', saveFavourite);
router.get('/:username/favorites', getFavourites);
router.delete('/:username/favorites/:id', deleteFavourites);

module.exports = router;
