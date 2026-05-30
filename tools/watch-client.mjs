import { context } from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const entry = resolve(__dirname, '..', 'src', 'client', 'main.ts');
const outfile = resolve(__dirname, '..', 'source', 'js', 'main.js');

const ctx = await context({
  entryPoints: [entry],
  bundle: true,
  minify: true,
  outfile,
});

await ctx.watch();
console.log('[client] Watching src/client/ for changes...');
