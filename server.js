const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require('mongoose');
const favoritesRoutes = require('./routes/userRoutes.js');

dotenv.config();
const app = express();
const allowedOrigins = ['https://movie-frontend-blue.vercel.app'];

app.use(cors({
  origin: ['https://movie-frontend-blue.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Movie API is running" });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/tmdb', require('./routes/tmbdRoutes.js'));
app.use('/api/favorites', favoritesRoutes);

// Export the app for Vercel
module.exports = app;

// Only listen locally when not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}