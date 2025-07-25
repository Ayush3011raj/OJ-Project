const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'outputs');
if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

const executeCpp = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split('.')[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  return new Promise((resolve, reject) => {
    const command = `g++ "${filepath}" -o "${outPath}" && "${outPath}" < "${inputPath}"`;

    // ⏱️ Set timeout to 5000ms and kill process group on TLE
    exec(command, { timeout: 15000, killSignal: 'SIGKILL' }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed) {
          return reject({ stderr: 'Time Limit Exceeded' });
        }
        if (error.message.includes('ENOMEM') || stderr.includes('std::bad_alloc')) {
          return reject({ stderr: 'Memory Limit Exceeded' });
        }
        return reject({ stderr: error.message });
      }
      if (stderr) return reject({ stderr });
      resolve(stdout);
    });
  });
};

module.exports = { executeCpp };
