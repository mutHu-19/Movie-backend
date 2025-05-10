const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  deleteFavourites,
  getFavourites,
  saveFavourite
} = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

router.get('/:username', getFavourites);
router.post('/:username', saveFavourite);
router.delete('/:username/:id', deleteFavourites);

module.exports = router;
