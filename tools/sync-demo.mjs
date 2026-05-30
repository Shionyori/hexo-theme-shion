import { cp, rm } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const target = resolve(root, 'demo', 'themes', 'shion');

const dirs = ['layout', 'languages', 'source', 'scripts'];
const files = ['_config.yml', 'package.json'];

// Remove existing theme copy
await rm(target, { recursive: true, force: true });

// Copy directories
for (const dir of dirs) {
  const src = resolve(root, dir);
  const dest = resolve(target, dir);
  await cp(src, dest, { recursive: true });
}

// Copy individual files
for (const file of files) {
  const src = resolve(root, file);
  const dest = resolve(target, file);
  await cp(src, dest);
}

console.log('[sync] Theme synced to demo/themes/shion/');
