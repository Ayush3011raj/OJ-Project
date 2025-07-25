const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { runSubmission } = require('./index'); 
const { runCustom } = require('./runCustom');                       
const app = express();
const allowedOrigins = [
  'http://localhost:5173',         
  'https://oj-project-beta.vercel.app'  
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
app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB for Compiler'))
  .catch(err => console.error('❌ DB connection error:', err));


app.get('/', (req, res) => {
  res.json({ status: 'Compiler is online' });
});

app.post('/run', async (req, res) => {
  const { code, language, problemId, userId } = req.body;

  if (!userId || !code || !problemId) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const verdict = await runSubmission({ userId, language, code, problemId });
    res.json({ success: true, result: verdict });
  } catch (err) {
    console.error('Execution Error:', err);
    res.status(500).json({ success: false, error: err.message || 'Execution error' });
  }
});
app.post('/run-custom', async (req, res) => {
  const { code, language, input } = req.body;

  if (!code || !language) {
    return res.status(400).json({ success: false, error: 'Missing code or language' });
  }

  try {
    const result = await runCustom({ code, language, input });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error: ' + err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Compiler server running on port ${PORT}`);
});
