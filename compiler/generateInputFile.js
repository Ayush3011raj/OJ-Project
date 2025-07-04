const fs2 = require('fs');
const path2 = require('path');
const { v4: uuid2 } = require('uuid');

const dirInputs = path2.join(__dirname, 'inputs');
if (!fs2.existsSync(dirInputs)) {
  fs2.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = async (input) => {
  const jobID = uuid2();
  const input_filename = `${jobID}.txt`;
  const input_filePath = path2.join(dirInputs, input_filename);
  await fs2.writeFileSync(input_filePath, input);
  return input_filePath;
};

module.exports = { generateInputFile };