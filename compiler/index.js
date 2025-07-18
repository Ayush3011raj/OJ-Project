const mongoose = require('mongoose');
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');


const testCaseSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  input: { type: String, required: true },
  output: { type: String, required: true }
});

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  code: { type: String, required: true },
  language: { type: String, default: 'cpp' },
  verdict: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const TestCase = mongoose.model('TestCase', testCaseSchema);
const Submission = mongoose.model('Submission', submissionSchema);

const runSubmission = async ({ userId, language, code, problemId }) => {
  if (!code) throw new Error('No code provided');
  if (language !== 'cpp') throw new Error('Only C++ supported currently');

  const filepath = await generateFile(language, code);
  const testCases = await TestCase.find({ problemId });

  if (!testCases.length) throw new Error('No test cases found');

  let verdict = 'Accepted';

  for (let i = 0; i < testCases.length; i++) {
    const inputPath = await generateInputFile(testCases[i].input);

    try {
      const output = await executeCpp(filepath, inputPath);
      const expected = testCases[i].output.trim();
      const actual = output.trim();

      if (expected !== actual) {
        verdict = `Wrong Answer on Test Case ${i + 1}`;
        break;
      }
    } catch (err) {
      verdict = `Compilation or Runtime Error on Test Case ${i + 1}:\n${err.stderr || err}`;
      break;
    }
  }
  console.log('Saving submission with:', {
  userId, problemId, language, verdict
});


  await Submission.create({
    userId,
    problemId,
    language,
    code,
    verdict,
  });

  return verdict;
};

module.exports = { runSubmission };
