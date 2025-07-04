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

// Connect and insert
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const problemId = new mongoose.Types.ObjectId('6854381492b8027314e097e2'); // update as needed

    const testCases = [
      {
        problemId,
        input: '3\n5\n',
        output: '8\n'
      },
      {
        problemId,
        input: '10\n-2\n',
        output: '8\n'
      },
      {
        problemId,
        input: '0\n0\n',
        output: '0\n'
      }
    ];

    await TestCase.insertMany(testCases);
    console.log('✅ Test cases inserted successfully');

    await mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Mongo error:', err);
  });
