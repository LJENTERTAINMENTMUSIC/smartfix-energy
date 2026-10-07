import './check-node.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

process.env.NODE_ENV = 'production';
const { build } = await import('vite');

console.log('Building main website...');
await build({ mode: 'production' });

console.log('Building admin dashboard...');
const adminDir = path.resolve('admin-app');
execSync('npm install && npx vite build --base=/admin/', {
  cwd: adminDir,
  stdio: 'inherit',
  shell: true,
});

console.log('Copying admin app to dist/admin...');
const adminDist = path.join(adminDir, 'dist');
const targetAdmin = path.resolve('dist', 'admin');
fs.mkdirSync(targetAdmin, { recursive: true });
fs.cpSync(adminDist, targetAdmin, { recursive: true });

console.log('Full build completed successfully!');
