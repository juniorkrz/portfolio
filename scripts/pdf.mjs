// scripts/pdf.mjs — imprime dist/cv/{pt,en}.html em PDF (A4) usando Edge/Chrome headless.
// uso: node build.mjs && node scripts/pdf.mjs   -> assets/cv/antonio-roberto-junior-cv-{pt,en}.pdf
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const browser = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
].find((p) => fs.existsSync(p));
if (!browser) throw new Error('Chrome/Edge não encontrado');

fs.mkdirSync(path.join(ROOT, 'assets/cv'), { recursive: true });
for (const lang of ['pt', 'en']) {
  const src = 'file:///' + path.join(ROOT, 'dist/cv', `${lang}.html`).replace(/\\/g, '/');
  const out = path.join(ROOT, 'assets/cv', `antonio-roberto-junior-cv-${lang}.pdf`);
  execFileSync(browser, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=3000', `--print-to-pdf=${out}`, src], { stdio: 'ignore' });
  console.log('pdf ->', path.relative(ROOT, out), (fs.statSync(out).size / 1024).toFixed(0) + ' KB');
}
