// build.mjs — gera dist/ a partir de src/ + assets/ (sem dependências externas)
// uso: node build.mjs            -> build completo
//      node build.mjs --og       -> também renderiza a imagem Open Graph (precisa de Edge/Chrome)
//      node build.mjs --serve    -> build + servidor local em http://127.0.0.1:4173
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { render, renderOg, render404 } from './src/render.mjs';
import { renderCv } from './src/cv/cv.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const args = new Set(process.argv.slice(2));

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = (buf) => crypto.createHash('sha1').update(buf).digest('hex').slice(0, 8);

function rmrf(p) { fs.rmSync(p, { recursive: true, force: true }); }
function mkdirp(p) { fs.mkdirSync(p, { recursive: true }); }
function copyDir(from, to) {
  mkdirp(to);
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    e.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
}

// ---------- conteúdo ----------
const content = {
  site: readJson(path.join(SRC, 'content/site.json')),
  featured: readJson(path.join(SRC, 'content/featured.json')).featured,
  secondary: readJson(path.join(SRC, 'content/secondary.json')).secondary,
  homelab: readJson(path.join(SRC, 'content/homelab.json')),
  extra: readJson(path.join(SRC, 'content/extra.json')),
  cv: readJson(path.join(SRC, 'content/cv.json')),
};

// ---------- saída ----------
rmrf(DIST);
mkdirp(path.join(DIST, 'assets'));
copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));

// css/js com hash no nome (cache imutável em /assets/)
const css = fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(SRC, 'app.js'), 'utf8');
const jsName = `app.${hash(js)}.js`;
fs.writeFileSync(path.join(DIST, 'assets', jsName), js);

const buildInfo = {
  jsPath: `/assets/${jsName}`,
  css, // CSS entra inline no <head> (evita 1 request e garante render sem FOUC)
  year: new Date().getFullYear(),
  updated: new Date().toISOString().slice(0, 10),
};

const { html, en } = render(content, buildInfo);
fs.writeFileSync(path.join(DIST, 'index.html'), html);
mkdirp(path.join(DIST, 'i18n'));
fs.writeFileSync(path.join(DIST, 'i18n/en.json'), JSON.stringify(en));

fs.writeFileSync(path.join(DIST, '404.html'), render404(content, buildInfo));

// CV (HTML para conferência + PDFs já gerados em assets/cv, copiados para /cv/)
mkdirp(path.join(DIST, 'cv'));
if (fs.existsSync(path.join(ROOT, 'assets/cv'))) {
  for (const f of fs.readdirSync(path.join(ROOT, 'assets/cv'))) {
    if (f.endsWith('.pdf')) fs.copyFileSync(path.join(ROOT, 'assets/cv', f), path.join(DIST, 'cv', f));
  }
  rmrf(path.join(DIST, 'assets/cv'));
}
for (const lang of ['pt', 'en']) {
  fs.writeFileSync(path.join(DIST, 'cv', `${lang}.html`), renderCv(content.cv[lang], lang));
}

// OG image: renderiza dist/og.html -> assets/og.png (só quando pedido; commita o PNG em assets/)
fs.writeFileSync(path.join(DIST, 'og.html'), renderOg(content, buildInfo));
if (args.has('--og')) {
  const edge = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/chromium', '/usr/bin/google-chrome']
    .find((p) => fs.existsSync(p));
  if (!edge) throw new Error('Nenhum Chrome/Edge encontrado para renderizar a OG image');
  const out = path.join(ROOT, 'assets', 'og.png');
  execFileSync(edge, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1200,630', '--virtual-time-budget=4000',
    `--screenshot=${out}`, 'file:///' + path.join(DIST, 'og.html').replace(/\\/g, '/')], { stdio: 'ignore' });
  fs.copyFileSync(out, path.join(DIST, 'assets', 'og.png'));
  console.log('og image ->', out);
}

// robots / sitemap / manifest
const SITE = 'https://jrkrz.xyz';
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /og.html\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE}/</loc><lastmod>${buildInfo.updated}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'site.webmanifest'), JSON.stringify({
  name: 'Antônio Roberto Júnior · jrkrz', short_name: 'jrkrz', start_url: '/', display: 'browser',
  background_color: '#0B0716', theme_color: '#0B0716',
  icons: [{ src: '/assets/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
}, null, 2));

const size = (p) => (fs.statSync(p).size / 1024).toFixed(1) + ' KB';
console.log(`dist/index.html ${size(path.join(DIST, 'index.html'))} · ${jsName} ${size(path.join(DIST, 'assets', jsName))} · en.json ${size(path.join(DIST, 'i18n/en.json'))} · ${Object.keys(en).length} strings i18n`);

// ---------- servidor local opcional ----------
if (args.has('--serve')) {
  process.env.PORT = process.env.PORT || '4173';
  process.env.ROOT = DIST;
  await import('./server/server.js');
}
