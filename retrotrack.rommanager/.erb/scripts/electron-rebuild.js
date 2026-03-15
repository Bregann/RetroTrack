import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { dependencies } from '../../release/app/package.json';
import webpackPaths from '../configs/webpack.paths';

if (
  Object.keys(dependencies || {}).length > 0 &&
  fs.existsSync(webpackPaths.appNodeModulesPath)
) {
  const electronPkgPath = path.join(
    __dirname,
    '../../node_modules/electron/package.json',
  );
  const electronVersion = JSON.parse(
    fs.readFileSync(electronPkgPath, 'utf8'),
  ).version;
  const electronRebuildCmd = `../../node_modules/.bin/electron-rebuild --force --types prod,dev,optional --module-dir . --version ${electronVersion} --only better-sqlite3`;
  const cmd =
    process.platform === 'win32'
      ? electronRebuildCmd.replace(/\//g, '\\')
      : electronRebuildCmd;
  execSync(cmd, {
    cwd: webpackPaths.appPath,
    stdio: 'inherit',
  });
}
