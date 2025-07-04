const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { runSubmission } = require('./index');                        
const app = express();
app.use(cors());
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

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Compiler server running on port ${PORT}`);
});
