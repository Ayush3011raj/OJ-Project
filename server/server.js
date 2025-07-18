const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/problems', require('./routes/problems'));
app.use('/', require('./routes/ai'));


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to database");
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.error(err));