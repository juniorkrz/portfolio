// src/render.mjs — template do site (funções que devolvem HTML). PT-BR fica no HTML;
// toda string bilíngue ganha data-i18n="<caminho>" e o EN vai para dist/i18n/en.json.

const SITE_URL = 'https://jrkrz.xyz';
const EMAIL = 'jrrobertokrz@gmail.com';
const SOCIAL = {
  github: 'https://github.com/juniorkrz',
  linkedin: 'https://www.linkedin.com/in/junior-krz/',
  instagram: 'https://www.instagram.com/juniorkrz.dev',
};
const CV_FILES = { pt: '/cv/antonio-roberto-junior-cv-pt.pdf', en: '/cv/antonio-roberto-junior-cv-en.pdf' };

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// markdown mínimo: **negrito** e `código`
export const md = (s) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/`(.+?)`/g, '<code>$1</code>');

const get = (obj, keyPath) => keyPath.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

// ---------- ícones (stroke currentColor, 24x24) ----------
const I = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
  ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>',
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>',
  sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
  // home lab / pilares
  server: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/></svg>',
  camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8a2 2 0 0 1 2-2h3l2-2h4l2 2h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  brain: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V4z"/></svg>',
  mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></svg>',
  shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  workflow: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><path d="M9 6h6M6 9v9h9"/></svg>',
  tunnel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V11a8 8 0 0 1 16 0v9"/><path d="M8 20v-8a4 4 0 0 1 8 0v8"/></svg>',
  message: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.7 7.1L4 21l1.9-5.3A8 8 0 1 1 21 12z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18a4 4 0 0 1-.6-7.9A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/></svg>',
  layers: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5M3 17l9 5 9-5"/></svg>',
  code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>',
  spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>',
};
const icon = (name) => I[name] || I.spark;
const PILLAR_ICONS = ['message', 'layers', 'server'];

// ---------- render principal ----------
export function render(C, B) {
  const en = {};
  // t(): registra a string bilíngue e devolve o PT escapado (ou com markdown mínimo)
  const t = (key, useMd = false) => {
    const v = get(C, key);
    if (!v || typeof v.pt !== 'string' || typeof v.en !== 'string') throw new Error(`conteúdo ausente: ${key}`);
    en[key] = v.en;
    return useMd ? md(v.pt) : esc(v.pt);
  };
  const attr = (key, useMd = false) => `data-i18n="${key}"${useMd ? ' data-i18n-md' : ''}`;
  // elemento simples com texto traduzível
  const T = (tag, key, cls = '', extra = '', useMd = false) =>
    `<${tag}${cls ? ` class="${cls}"` : ''} ${attr(key, useMd)}${extra ? ' ' + extra : ''}>${t(key, useMd)}</${tag}>`;
  const tags = (list, cls = 'tags') => `<ul class="${cls}" aria-label="Stack">${list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;

  const S = C.site;
  const name = S.hero.name;
  const nameParts = name.trim().split(' ');
  const last = nameParts.pop();
  const first = nameParts.join(' ');

  const navItems = [
    ['sobre', 'site.nav.about'], ['projetos', 'site.nav.projects'], ['homelab', 'site.nav.homelab'],
    ['trajetoria', 'site.nav.journey'], ['stack', 'site.nav.stack'], ['contato', 'site.nav.contact'],
  ];

  const allStack = [...new Set(S.stack.groups.flatMap((g) => g.items))];

  // ----- head -----
  const head = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title ${attr('site.meta.title')}>${t('site.meta.title')}</title>
<meta name="description" ${attr('site.meta.description')} data-i18n-attr="content" content="${t('site.meta.description')}">
<meta name="author" content="${esc(name)}">
<meta name="theme-color" content="#0B0716">
<meta name="color-scheme" content="dark light">
<link rel="canonical" href="${SITE_URL}/">
<link rel="alternate" hreflang="pt-BR" href="${SITE_URL}/">
<link rel="alternate" hreflang="en" href="${SITE_URL}/?lang=en">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE_URL}/">
<meta property="og:title" content="${t('site.meta.og_title')}">
<meta property="og:description" content="${t('site.meta.og_description')}">
<meta property="og:image" content="${SITE_URL}/assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="pt_BR">
<meta property="og:locale:alternate" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t('site.meta.og_title')}">
<meta name="twitter:description" content="${t('site.meta.og_description')}">
<meta name="twitter:image" content="${SITE_URL}/assets/og.png">
<link rel="preload" href="/assets/fonts/syne-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/manrope-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/jetbrains-mono-var.woff2" as="font" type="font/woff2" crossorigin>
<script>try{var th=localStorage.getItem('theme');if(th==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}</script>
<style>${B.css}</style>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Person', name, alternateName: 'jrkrz', url: SITE_URL + '/',
    image: SITE_URL + '/assets/img/avatar-512.webp', email: 'mailto:' + EMAIL, jobTitle: S.hero.role.pt,
    worksFor: { '@type': 'Organization', name: 'DTEL Telecom' },
    address: { '@type': 'PostalAddress', addressLocality: 'Recife', addressRegion: 'PE', addressCountry: 'BR' },
    sameAs: Object.values(SOCIAL),
  })}</script>
</head>`;

  // ----- header/nav -----
  const header = `
<a class="skip" href="#conteudo" ${attr('site.ui.skip')}>${t('site.ui.skip')}</a>
<header class="nav" id="topo">
  <div class="wrap nav-in">
    <a class="logo" href="#inicio" aria-label="${esc(name)}"><span class="logo-dot" aria-hidden="true"></span>jrkrz<span class="logo-tld">.xyz</span></a>
    <nav class="nav-links" id="menu" aria-label="Seções">
      <ul>${navItems.map(([id, key], i) => `<li><a href="#${id}" data-spy="${id}"><span class="n mono" aria-hidden="true">0${i + 1}</span><span ${attr(key)}>${t(key)}</span></a></li>`).join('')}</ul>
    </nav>
    <div class="nav-ctl">
      <div class="lang" role="group" aria-label="${t('site.ui.lang_toggle')}" ${attr('site.ui.lang_toggle')} data-i18n-attr="aria-label">
        <button type="button" class="lang-btn is-on" data-lang="pt" aria-pressed="true" lang="pt-BR">PT</button>
        <button type="button" class="lang-btn" data-lang="en" aria-pressed="false" lang="en">EN</button>
      </div>
      <button type="button" class="icon-btn theme-btn" id="theme" aria-label="${t('site.ui.theme_toggle')}" ${attr('site.ui.theme_toggle')} data-i18n-attr="aria-label"><span class="ic-sun">${I.sun}</span><span class="ic-moon">${I.moon}</span></button>
      <button type="button" class="icon-btn menu-btn" id="menu-btn" aria-expanded="false" aria-controls="menu" aria-label="${t('site.ui.menu')}" ${attr('site.ui.menu')} data-i18n-attr="aria-label"><span class="ic-open">${I.menu}</span><span class="ic-close">${I.close}</span></button>
    </div>
  </div>
</header>`;

  // ----- hero -----
  const consoleLines = C.extra.console.lines.map((l, i) =>
    `<li style="--i:${i}"><span class="c-time mono" aria-hidden="true">${esc(l.time)}</span><span class="c-tag mono">[${esc(l.tag)}]</span> <span ${attr(`extra.console.lines.${i}.text`)}>${t(`extra.console.lines.${i}.text`)}</span></li>`).join('');

  const hero = `
<section class="hero" id="inicio">
  <div class="hero-bg" aria-hidden="true"><i class="aurora a1"></i><i class="aurora a2"></i><i class="aurora a3"></i><i class="hgrid"></i></div>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="kicker mono rv"><span class="dot" aria-hidden="true"></span><span ${attr('site.hero.kicker')}>${t('site.hero.kicker')}</span></p>
      <h1 class="hero-name rv" style="--i:1">${first.split(' ').map((w) => `<span class="line">${esc(w)}</span>`).join('')}<span class="line">${esc(last)}<em>.</em></span></h1>
      <p class="hero-role mono rv" style="--i:2">&gt; ${T('span', 'site.hero.role')}</p>
      ${T('p', 'site.hero.pitch', 'hero-pitch rv', 'style="--i:3"', true)}
      <div class="hero-ctas rv" style="--i:4">
        <a class="btn btn-primary" href="#projetos"><span ${attr('site.hero.cta_primary')}>${t('site.hero.cta_primary')}</span>${I.down}</a>
        <a class="btn btn-ghost" href="#contato"><span ${attr('site.hero.cta_secondary')}>${t('site.hero.cta_secondary')}</span>${I.arrow}</a>
      </div>
      ${tags(S.hero.chips, 'chips hero-chips rv')}
      <dl class="metrics rv" style="--i:6">
        ${S.hero.metrics.map((m, i) => `<div><dt ${attr(`site.hero.metrics.${i}.label`)}>${t(`site.hero.metrics.${i}.label`)}</dt><dd>${esc(m.value)}</dd></div>`).join('')}
      </dl>
    </div>
    <div class="hero-visual rv" style="--i:2" aria-hidden="true">
      <div class="console" id="console">
        <div class="console-bar"><i></i><i></i><i></i><span class="mono">${esc(C.extra.console.title)}</span></div>
        <ol class="console-lines">${consoleLines}</ol>
        <div class="console-cursor mono">$ <span class="caret"></span></div>
      </div>
      <span class="float f1 mono">${esc(C.extra.floating[0])}</span>
      <span class="float f2 mono">${esc(C.extra.floating[1])}</span>
      <span class="float f3 mono">${esc(C.extra.floating[2])}</span>
    </div>
  </div>
  <a class="scroll-hint mono" href="#sobre"><span ${attr('site.ui.scroll')}>${t('site.ui.scroll')}</span><i aria-hidden="true"></i></a>
</section>
<div class="ticker" aria-hidden="true"><div class="ticker-track">${allStack.map((x) => `<span>${esc(x)}</span>`).join('<i>·</i>')}</div></div>`;

  // ----- sobre -----
  const eyebrow = (n, key) => `<p class="eyebrow mono"><span class="num">${n}</span><span ${attr(key)}>${t(key)}</span></p>`;
  const about = `
<section class="section" id="sobre">
  <div class="wrap">
    ${eyebrow('01', 'site.about.eyebrow')}
    ${T('h2', 'site.about.statement', 'statement rv', '', true)}
    <div class="about-grid">
      <div class="about-text rv">${S.about.paragraphs.map((_, i) => T('p', `site.about.paragraphs.${i}`, '', '', true)).join('')}</div>
      <aside class="about-side rv" style="--i:1">
        <div class="portrait"><picture><source type="image/webp" srcset="/assets/img/avatar-320.webp 1x, /assets/img/avatar-512.webp 2x"><img src="/assets/img/avatar-320.jpg" width="320" height="320" alt="${esc(name)}" loading="lazy" decoding="async"></picture></div>
        <dl class="facts">${S.about.facts.map((_, i) => `<div><dt class="mono" ${attr(`site.about.facts.${i}.label`)}>${t(`site.about.facts.${i}.label`)}</dt><dd ${attr(`site.about.facts.${i}.value`)}>${t(`site.about.facts.${i}.value`)}</dd></div>`).join('')}</dl>
      </aside>
    </div>
    <div class="pillars">${S.about.pillars.map((p, i) => `
      <article class="pillar rv" style="--i:${i}">
        <span class="pi" aria-hidden="true">${icon(PILLAR_ICONS[i])}</span>
        ${T('h3', `site.about.pillars.${i}.title`)}
        ${T('p', `site.about.pillars.${i}.text`)}
        ${tags(p.tags)}
      </article>`).join('')}</div>
  </div>
</section>`;

  // ----- projetos -----
  const shot = (p, i) => {
    if (p.id === 'stickerbot') {
      const M = C.extra.mock;
      const SB = '/assets/img/stickerbot';
      const ticks = '<svg class="wa-ticks" viewBox="0 0 16 11" aria-hidden="true"><path d="M1 6l3 3 6-7M6 9l1 1 7-8"/></svg>';
      const meta = (me) => `<span class="wa-meta"><time class="wa-time">08:02</time>${me ? ticks : ''}</span>`;
      return `<div class="phone" aria-hidden="true">
        <div class="phone-screen">
          <div class="wa-status"><time class="wa-clock">08:02</time><span class="wa-sys"><i></i><i></i><i></i></span></div>
          <div class="wa-head">
            <svg viewBox="0 0 24 24" class="wa-back"><path d="M15 5l-7 7 7 7"/></svg>
            <img class="wa-av" src="${SB}/avatar-80.webp" srcset="${SB}/avatar-80.webp 1x, ${SB}/avatar-160.webp 2x" width="36" height="36" alt="" loading="lazy" decoding="async">
            <div class="wa-who"><b>${esc(M.name)}</b><small class="wa-presence" data-online="${t('extra.mock.status')}" data-typing="${t('extra.mock.typing')}" ${attr('extra.mock.status')}>${t('extra.mock.status')}</small></div>
            <span class="wa-icons"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="12" height="12" rx="2"/><path d="m15 10 6-3v10l-6-3"/></svg><svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg><svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg></span>
          </div>
          <div class="wa-chat" id="wa-chat">
            <div class="wa-day"><span ${attr('extra.mock.today')}>${t('extra.mock.today')}</span></div>
            <div class="wa-msg me media" data-step="user"><img src="${SB}/photo.webp" width="480" height="480" alt="" loading="lazy" decoding="async">${meta(true)}<span class="wa-react">✅</span></div>
            <div class="wa-msg bot sticker" data-step="bot"><img src="${SB}/sticker.webp" width="320" height="320" alt="" loading="lazy" decoding="async">${meta(false)}</div>
            <div class="wa-msg me" data-step="user"><p><span ${attr('extra.mock.user2')}>${t('extra.mock.user2')}</span>${meta(true)}</p><span class="wa-react">✅</span></div>
            <div class="wa-msg bot" data-step="bot"><p><span ${attr('extra.mock.bot2', true)}>${t('extra.mock.bot2', true)}</span>${meta(false)}</p></div>
            <div class="wa-typing" id="wa-typing"><i></i><i></i><i></i></div>
          </div>
          <div class="wa-input">
            <span class="wa-field"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8.5 14a4 4 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/></svg><span class="wa-draft" id="wa-draft"></span><span class="wa-ph" ${attr('extra.mock.placeholder')}>${t('extra.mock.placeholder')}</span></span>
            <span class="wa-mic"><svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></span>
          </div>
        </div>
      </div>`;
    }
    const base = `/assets/img/projects/${p.id}`;
    return `<picture class="shot-img">
      <source type="image/webp" srcset="${base}.webp 960w, ${base}@2x.webp 1440w" sizes="(min-width: 900px) 46vw, 92vw">
      <img src="${base}.jpg" srcset="${base}.jpg 960w, ${base}@2x.jpg 1440w" sizes="(min-width: 900px) 46vw, 92vw" width="960" height="600" alt="" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async">
    </picture>`;
  };

  const panels = C.featured.map((p, i) => {
    const k = `featured.${i}`;
    const live = p.live_url ? `<a class="link" href="${esc(p.live_url)}" target="_blank" rel="noopener"><span ${attr(`${k}.live_label`)}>${t(`${k}.live_label`)}</span>${I.ext}</a>` : '';
    const code = p.code_private
      ? `<span class="link soft" ${attr('site.projects_section.private_code')}>${t('site.projects_section.private_code')}</span>`
      : (p.code_url ? `<a class="link" href="${esc(p.code_url)}" target="_blank" rel="noopener">${I.github}<span ${attr('site.projects_section.code')}>${t('site.projects_section.code')}</span>${I.ext}</a>` : '');
    return `
    <article class="panel rv${i % 2 ? ' rev' : ''}" id="p-${esc(p.id)}" data-tilt>
      <div class="shot">
        <span class="idx mono" aria-hidden="true">0${i + 1}</span>
        <span class="badge mono" ${attr(`${k}.badge`)}>${t(`${k}.badge`)}</span>
        ${shot(p, i)}
      </div>
      <div class="info">
        <p class="kind mono" ${attr(`${k}.kind`)}>${t(`${k}.kind`)}</p>
        ${T('h3', `${k}.title`)}
        ${T('p', `${k}.pitch`, 'pitch', '', true)}
        <ul class="hl">${p.bullets.map((_, j) => T('li', `${k}.bullets.${j}`, '', '', true)).join('')}</ul>
        ${tags(p.tags)}
        <div class="links">${live}${code}</div>
        <p class="role mono"><span ${attr(`${k}.role`)}>${t(`${k}.role`)}</span> · ${esc(p.year)}</p>
      </div>
    </article>`;
  }).join('');

  const cells = C.secondary.map((c, i) => {
    const k = `secondary.${i}`;
    const link = c.url ? `<a class="ar" href="${esc(c.url)}" target="_blank" rel="noopener" aria-label="${esc(c.name)}: ${t(`${k}.url_label`)}" ${attr(`${k}.url_label`)} data-i18n-attr="aria-label">${I.arrow}</a>` : '';
    return `
    <article class="cell rv" style="--i:${i % 4}">
      <div class="yr mono"><span>${esc(c.year)}</span><span ${attr(`${k}.category`)}>${t(`${k}.category`)}</span></div>
      <h4>${esc(c.name)}</h4>
      ${T('p', `${k}.blurb`, '', '', true)}
      ${tags(c.tags)}
      ${link}
      ${c.code_private && !c.url ? `<span class="soft mono" ${attr('site.projects_section.private_code')}>${t('site.projects_section.private_code')}</span>` : ''}
    </article>`;
  }).join('');

  const projects = `
<section class="section alt" id="projetos">
  <div class="wrap">
    ${eyebrow('02', 'site.projects_section.eyebrow')}
    ${T('h2', 'site.projects_section.title', 'h2 rv', '', true)}
    ${T('p', 'site.projects_section.lead', 'lead rv', '', true)}
    <div class="panels">${panels}</div>
    ${T('h3', 'site.projects_section.also_built', 'also rv')}
    <div class="cells">${cells}</div>
  </div>
</section>`;

  // ----- home lab -----
  const homelab = `
<section class="section" id="homelab">
  <div class="wrap">
    ${eyebrow('03', 'homelab.eyebrow')}
    ${T('h2', 'homelab.title', 'h2 rv', '', true)}
    ${T('p', 'homelab.lead', 'lead rv', '', true)}
    <div class="lab">${C.homelab.items.map((it, i) => `
      <article class="lab-card rv" style="--i:${i % 3}">
        <span class="pi" aria-hidden="true">${icon(it.icon)}</span>
        ${T('h3', `homelab.items.${i}.title`)}
        ${T('p', `homelab.items.${i}.text`, '', '', true)}
        ${tags(it.tags)}
      </article>`).join('')}</div>
    ${T('p', 'homelab.closing', 'closing rv', '', true)}
  </div>
</section>`;

  // ----- trajetória -----
  const journey = `
<section class="section alt" id="trajetoria">
  <div class="wrap">
    ${eyebrow('04', 'site.journey.eyebrow')}
    ${T('h2', 'site.journey.title', 'h2 rv', '', true)}
    <ol class="tl" id="tl">${S.journey.items.map((it, i) => `
      <li class="tl-item rv type-${esc(it.type)}">
        <span class="tl-dot" aria-hidden="true"></span>
        <div class="tl-meta"><span class="tl-period mono" ${attr(`site.journey.items.${i}.period`)}>${t(`site.journey.items.${i}.period`)}</span><span class="tl-type mono" ${attr(`site.journey.items.${i}.type_label`)}>${t(`site.journey.items.${i}.type_label`)}</span></div>
        <div class="tl-body">
          <h3><span ${attr(`site.journey.items.${i}.title`)}>${t(`site.journey.items.${i}.title`)}</span> <span class="tl-org" ${attr(`site.journey.items.${i}.org`)}>${t(`site.journey.items.${i}.org`)}</span></h3>
          ${T('p', `site.journey.items.${i}.text`, '', '', true)}
          ${it.bullets.length ? `<ul class="hl">${it.bullets.map((_, j) => T('li', `site.journey.items.${i}.bullets.${j}`, '', '', true)).join('')}</ul>` : ''}
        </div>
      </li>`).join('')}</ol>
  </div>
</section>`;

  // ----- stack -----
  const stack = `
<section class="section" id="stack">
  <div class="wrap">
    ${eyebrow('05', 'site.stack.eyebrow')}
    ${T('h2', 'site.stack.title', 'h2 rv', '', true)}
    ${T('p', 'site.stack.lead', 'lead rv', '', true)}
    <div class="stack">${S.stack.groups.map((g, i) => `
      <div class="stack-group rv" style="--i:${i % 3}">
        <h3 class="mono" ${attr(`site.stack.groups.${i}.name`)}>${t(`site.stack.groups.${i}.name`)}</h3>
        ${tags(g.items, 'tags big')}
      </div>`).join('')}</div>
  </div>
</section>`;

  // ----- contato -----
  const contact = `
<section class="section alt" id="contato">
  <div class="wrap">
    ${eyebrow('06', 'site.contact.eyebrow')}
    ${T('h2', 'site.contact.title', 'contact-big rv', '', true)}
    ${T('p', 'site.contact.text', 'lead rv', '', true)}
    <div class="contact-grid rv">
      <div class="email-row">
        <a class="email" href="mailto:${EMAIL}">${I.mail}<span>${EMAIL}</span></a>
        <button type="button" class="copy" id="copy" data-copy="${EMAIL}" data-copied="${t('site.contact.copied')}" data-copy-label="${t('site.contact.copy')}">${I.copy}<span ${attr('site.contact.copy')}>${t('site.contact.copy')}</span></button>
      </div>
      <ul class="socials">
        <li><a href="${SOCIAL.github}" target="_blank" rel="noopener me"><span class="s-label mono">GitHub</span><span class="s-val">@juniorkrz</span>${I.ext}</a></li>
        <li><a href="${SOCIAL.linkedin}" target="_blank" rel="noopener me"><span class="s-label mono">LinkedIn</span><span class="s-val">/in/junior-krz</span>${I.ext}</a></li>
        <li><a href="${SOCIAL.instagram}" target="_blank" rel="noopener me"><span class="s-label mono">Instagram</span><span class="s-val">@juniorkrz.dev</span>${I.ext}</a></li>
      </ul>
      <div class="cv-row">
        <span class="mono cv-label" ${attr('site.contact.cv_label')}>${t('site.contact.cv_label')}</span>
        <a class="btn btn-ghost" href="${CV_FILES.pt}" download>${I.file}<span ${attr('site.contact.cv_pt_label')}>${t('site.contact.cv_pt_label')}</span></a>
        <a class="btn btn-ghost" href="${CV_FILES.en}" download>${I.file}<span ${attr('site.contact.cv_en_label')}>${t('site.contact.cv_en_label')}</span></a>
      </div>
    </div>
  </div>
</section>`;

  const footer = `
<footer class="footer">
  <div class="wrap footer-in">
    <span>© ${B.year} ${esc(name)} · <span ${attr('site.footer.made', true)}>${t('site.footer.made', true)}</span></span>
    <a href="#inicio" class="mono">↑ <span ${attr('site.footer.top')}>${t('site.footer.top')}</span></a>
  </div>
</footer>`;

  const html = `${head}
<body>
${header}
<main id="conteudo">
${hero}
${about}
${projects}
${homelab}
${journey}
${stack}
${contact}
</main>
${footer}
<script src="${B.jsPath}" defer></script>
</body>
</html>
`;
  return { html, en };
}

// ---------- OG image (1200x630) ----------
export function renderOg(C, B) {
  const S = C.site;
  const chips = S.hero.chips.slice(0, 6).map((c) => `<span>${esc(c)}</span>`).join('');
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${B.css}
html,body{width:1200px;height:630px;overflow:hidden;margin:0}
.og{position:relative;width:1200px;height:630px;background:var(--bg);color:var(--text);padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;font-family:var(--body)}
.og .aurora{position:absolute;border-radius:50%;filter:blur(90px);opacity:.55}
.og .a1{width:620px;height:620px;right:-160px;top:-260px;background:var(--accent-deep)}
.og .a2{width:420px;height:420px;left:-120px;bottom:-220px;background:#3B1D8F}
.og .hgrid{position:absolute;inset:0;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(ellipse at 30% 40%,#000 30%,transparent 75%);opacity:.6}
.og .k{position:relative;font-family:var(--mono);text-transform:uppercase;letter-spacing:.14em;color:var(--accent);font-size:20px;display:flex;gap:12px;align-items:center}
.og .k::before{content:"";width:10px;height:10px;border-radius:50%;background:var(--ok);box-shadow:0 0 18px var(--ok)}
.og h1{position:relative;font-family:var(--display);font-size:104px;line-height:.95;letter-spacing:-.03em;margin:18px 0 0}
.og h1 em{color:var(--accent);font-style:normal}
.og .r{position:relative;font-family:var(--mono);font-size:26px;color:var(--text-2);margin-top:22px}
.og .chips{position:relative;display:flex;gap:10px;flex-wrap:wrap}
.og .chips span{font-family:var(--mono);font-size:18px;border:1px solid var(--line-2);border-radius:8px;padding:8px 14px;color:var(--text-2);background:rgba(255,255,255,.02)}
.og .url{position:absolute;right:80px;bottom:72px;font-family:var(--mono);font-size:24px;color:var(--accent-2)}
</style></head><body><div class="og"><i class="aurora a1"></i><i class="aurora a2"></i><i class="hgrid"></i>
<div><p class="k">${esc(S.hero.kicker.pt)}</p><h1>${esc(S.hero.name)}<em>.</em></h1><p class="r">&gt; ${esc(S.hero.role.pt)}</p></div>
<div class="chips">${chips}</div><span class="url">jrkrz.xyz</span></div></body></html>`;
}

// ---------- 404 ----------
export function render404(C, B) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>404 · jrkrz.xyz</title><meta name="robots" content="noindex"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><style>${B.css}
.nf{min-height:100vh;display:grid;place-items:center;text-align:center;padding:var(--pad)}
.nf h1{font-family:var(--display);font-size:clamp(4rem,18vw,10rem);line-height:1;letter-spacing:-.04em;color:var(--accent)}
.nf p{color:var(--text-2);margin:12px 0 28px}</style></head><body><main class="nf"><div><h1>404</h1><p>${esc(C.extra.notfound.pt)} · <span lang="en">${esc(C.extra.notfound.en)}</span></p><a class="btn btn-primary" href="/">jrkrz.xyz</a></div></main></body></html>`;
}
