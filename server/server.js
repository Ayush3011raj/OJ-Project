const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',         // for local frontend
  'https://oj-project-beta.vercel.app'  // for deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const submissionRoutes = require('./routes/submissionRoutes');
app.use('/api/submissions', submissionRoutes);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/problems', require('./routes/problems'));
app.use('/', require('./routes/ai'));


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to database");
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.error(err));
