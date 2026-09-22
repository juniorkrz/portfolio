'use strict';
// Servidor estático do portfólio (sem dependências). Serve ./public em 127.0.0.1:PORT atrás do cloudflared.
// Em produção: /opt/portfolio/server.js + /opt/portfolio/public. Local: node build.mjs --serve
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3939);
const HOST = process.env.HOST || '127.0.0.1';
const ROOT = process.env.ROOT || path.join(__dirname, 'public');
const CANONICAL_HOST = 'jrkrz.xyz';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

const CSP = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; " +
  // o hash cobre o único script inline (leitura do tema no <head>, ver src/render.mjs)
  "script-src 'self' 'sha256-oIMoSsMdbK65evl7WZ+MlvOBtg5RAr2yDJnuCI9PU30=' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; " +
  "font-src 'self'; frame-src 'none'; base-uri 'none'; form-action 'none'; object-src 'none'; frame-ancestors 'self'";

const REDIRECTS = {
  '/cv': '/cv/antonio-roberto-junior-cv-pt.pdf',
  '/cv/': '/cv/antonio-roberto-junior-cv-pt.pdf',
  '/cv/pt': '/cv/antonio-roberto-junior-cv-pt.pdf',
  '/cv/en': '/cv/antonio-roberto-junior-cv-en.pdf',
  '/curriculo': '/cv/antonio-roberto-junior-cv-pt.pdf',
  '/resume': '/cv/antonio-roberto-junior-cv-en.pdf',
  '/github': 'https://github.com/juniorkrz',
  '/linkedin': 'https://www.linkedin.com/in/junior-krz/',
};

function securityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), payment=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', CSP);
}

function send(res, status, body, headers) {
  res.writeHead(status, headers || {});
  res.end(body);
}

function notFound(res, method) {
  const nf = path.join(ROOT, '404.html');
  fs.readFile(nf, (err, buf) => {
    const headers = { 'Content-Type': err ? 'text/plain; charset=utf-8' : 'text/html; charset=utf-8', 'Cache-Control': 'no-store' };
    send(res, 404, method === 'HEAD' ? null : (err ? 'Not found' : buf), headers);
  });
}

const server = http.createServer((req, res) => {
  securityHeaders(res);
  const host = (req.headers.host || '').toLowerCase().split(':')[0];
  if (host === 'www.' + CANONICAL_HOST) {
    return send(res, 301, null, { Location: 'https://' + CANONICAL_HOST + req.url });
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, 'Method Not Allowed', { 'Content-Type': 'text/plain', Allow: 'GET, HEAD' });
  }
  let urlPath;
  try { urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname); }
  catch (e) { return send(res, 400, 'Bad Request', { 'Content-Type': 'text/plain' }); }

  const clean = urlPath.length > 1 && urlPath.endsWith('/') && !fs.existsSync(path.join(ROOT, urlPath)) ? urlPath.slice(0, -1) : urlPath;
  if (REDIRECTS[clean]) return send(res, 302, null, { Location: REDIRECTS[clean], 'Cache-Control': 'no-store' });
  if (urlPath.endsWith('/')) urlPath += 'index.html';

  const filePath = path.join(ROOT, path.normalize(urlPath));
  if (!filePath.startsWith(ROOT)) return send(res, 403, 'Forbidden', { 'Content-Type': 'text/plain' });

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      const idx = path.join(filePath, 'index.html');
      return fs.stat(idx, (e2, s2) => (e2 || !s2.isFile()) ? notFound(res, req.method) : stream(idx, s2, urlPath + '/index.html'));
    }
    if (err || !stat.isFile()) return notFound(res, req.method);
    stream(filePath, stat, urlPath);
  });

  function stream(fp, stat, up) {
    const ext = path.extname(fp).toLowerCase();
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Content-Length': stat.size };
    if (ext === '.pdf') headers['Cache-Control'] = 'public, max-age=3600';
    else if (up.startsWith('/assets/') && /\.[0-9a-f]{8}\.(js|css)$/.test(up)) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    else if (up.startsWith('/assets/')) headers['Cache-Control'] = 'public, max-age=604800, stale-while-revalidate=86400';
    else if (ext === '.html' || ext === '.xml' || ext === '.txt' || ext === '.json' || ext === '.webmanifest') headers['Cache-Control'] = 'public, max-age=300';
    else headers['Cache-Control'] = 'public, max-age=86400';
    if (ext === '.html' && path.basename(fp) === 'og.html') headers['X-Robots-Tag'] = 'noindex';
    if (req.method === 'HEAD') return send(res, 200, null, headers);
    res.writeHead(200, headers);
    fs.createReadStream(fp).pipe(res);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`portfolio static server em http://${HOST}:${PORT} (root: ${ROOT})`);
});
