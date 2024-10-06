const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const pybackendDir = path.join(__dirname, '..', 'server', 'pybackend');
const venvPath = path.join(pybackendDir, 'venv');
const requirementsPath = path.join(pybackendDir, 'requirements.txt');
const envPath = path.join(pybackendDir, '.env');

function runCommand(command, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      console.log(stdout);
      console.error(stderr);
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function setup() {
  try {
    console.log('Installing Node.js dependencies...');
    await runCommand('npm install');

    if (!fs.existsSync(venvPath)) {
      console.log('Creating Python virtual environment...');
      await runCommand('python3 -m venv venv', pybackendDir);
    }

    console.log('Installing Python dependencies...');
    const activateCommand = process.platform === 'win32' ? 'venv\\Scripts\\activate' : 'source venv/bin/activate';
    await runCommand(`${activateCommand} && pip install -r requirements.txt`, pybackendDir);

    if (!fs.existsSync(envPath)) {
      console.log('Creating .env file...');
      fs.writeFileSync(envPath, 'OPENAI_API_KEY=your_api_key_here\n');
      console.log('Please update the OPENAI_API_KEY in server/pybackend/.env with your actual API key.');
    }

    console.log('Setup completed successfully.');
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
}

setup();