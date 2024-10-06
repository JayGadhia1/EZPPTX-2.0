const concurrently = require('concurrently');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', 'server', 'pybackend', '.env') });

const pythonPath = path.join(__dirname, '..', 'server', 'pybackend', 'venv', 'bin', 'python');
const serverPath = path.join(__dirname, '..', 'server', 'pybackend', 'server.py');

concurrently([
  { command: 'node server/server.js', name: 'node-server', prefixColor: 'blue' },
  { 
    command: `${pythonPath} ${serverPath}`,
    name: 'python-server',
    prefixColor: 'green',
    env: {
      ...process.env,
      PYTHONUNBUFFERED: '1'
    }
  },
  { command: 'ccweb-add-on-scripts start', name: 'addon', prefixColor: 'yellow' }
], {
  prefix: 'name',
  killOthers: ['failure', 'success'],
  restartTries: 3,
}).then(
  () => console.log('All processes exited successfully'),
  (error) => console.error('One of the processes exited with error:', error)
);