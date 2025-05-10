const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require('mongoose');
const favoritesRoutes = require('../routes/userRoutes.js');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api/users', require('../routes/userRoutes.js'));
app.use('/api/tmdb', require('../routes/tmbdRoutes.js'));
app.use('/api/favorites', favoritesRoutes);


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
