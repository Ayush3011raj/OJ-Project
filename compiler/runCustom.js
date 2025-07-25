const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executecpp');

const runCustom = async ({ code, language, input }) => {
  if (!code) throw new Error('No code provided');
  if (language !== 'cpp') throw new Error('Only C++ supported currently');

  const filepath = await generateFile(language, code);
  const inputPath = await generateInputFile(input || '');

  try {
    const output = await executeCpp(filepath, inputPath);
    return { success: true, output };
  } catch (err) {
    return {
      success: false,
      error: err.stderr || 'Execution failed',
    };
  }
};

module.exports = { runCustom };
