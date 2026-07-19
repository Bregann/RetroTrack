// Launches electronmon with ELECTRON_RUN_AS_NODE removed from the environment.
// If that variable is present (some shells/IDEs inject it), Electron starts in
// plain-Node mode: `electron.app` is undefined and the app crashes at startup
// (or fails a native snapshot assertion when the value is empty). Deleting it
// entirely — not setting it empty — is the only reliable fix, and cross-env
// cannot delete a variable, so we do it here before spawning.
const { spawn } = require('child_process');
const path = require('path');

delete process.env.ELECTRON_RUN_AS_NODE;

const electronmonBin = path.resolve(
  __dirname,
  '../../node_modules/.bin/electronmon' + (process.platform === 'win32' ? '.cmd' : ''),
);

// Everything after `--` on our own argv is forwarded to the app.
const forwarded = process.argv.slice(2);

const child = spawn(electronmonBin, ['.', '--', ...forwarded], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  cwd: path.resolve(__dirname, '../..'),
});

child.on('exit', (code) => process.exit(code == null ? 1 : code));
