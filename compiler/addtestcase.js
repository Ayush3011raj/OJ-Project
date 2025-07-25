const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('debug', true);

// Define schema and model
const testCaseSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  input: { type: String, required: true },
  output: { type: String, required: true }
});
const TestCase = mongoose.model('TestCase', testCaseSchema);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const problemId = new mongoose.Types.ObjectId('6854380592b8027314e097df'); // update as needed

    const testCases = [
      {
        problemId,
        input: '3 5',
        output: '2'
      },
      {
        problemId,
        input: '10 2',
        output: '8'
      },
      {
        problemId,
        input: '8 4',
        output: '4'
      },
      {
        problemId,
        input: '5 5',
        output: '0'
      }
    ];

    await TestCase.insertMany(testCases);
    console.log('✅ Test cases inserted successfully');

    await mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Mongo error:', err);
  });
