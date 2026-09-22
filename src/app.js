/* app.js — interações do portfólio (vanilla, sem dependências) */
(function () {
  'use strict';
  var d = document, root = d.documentElement, w = window;
  root.classList.add('js');
  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = w.matchMedia('(pointer: fine)').matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* privado */ } }
  };
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* ---------- tema ---------- */
  var themeBtn = $('#theme');
  var metaTheme = $('meta[name="theme-color"]');
  function applyTheme(t) {
    if (t === 'light') root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme');
    if (metaTheme) metaTheme.setAttribute('content', t === 'light' ? '#FAF8FF' : '#0B0716');
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(t === 'light'));
  }
  applyTheme(store.get('theme') === 'light' ? 'light' : 'dark');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next); store.set('theme', next);
  });

  /* ---------- i18n ---------- */
  var dict = { pt: null, en: null }, current = 'pt';
  var nodes = $$('[data-i18n]');
  function md(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code>$1</code>');
  }
  function snapshotPt() {
    var m = {};
    nodes.forEach(function (n) {
      var k = n.getAttribute('data-i18n'), a = n.getAttribute('data-i18n-attr');
      if (a) m[k] = n.getAttribute(a);
      else if (n.hasAttribute('data-i18n-md')) m[k] = n.innerHTML;
      else m[k] = n.textContent;
    });
    return m;
  }
  function apply(lang) {
    var m = dict[lang]; if (!m) return;
    nodes.forEach(function (n) {
      var k = n.getAttribute('data-i18n'); if (!(k in m)) return;
      var a = n.getAttribute('data-i18n-attr');
      if (a) n.setAttribute(a, m[k]);
      else if (n.hasAttribute('data-i18n-md')) n.innerHTML = lang === 'pt' ? m[k] : md(m[k]);
      else n.textContent = m[k];
    });
    root.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
    $$('.lang-btn').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on));
    });
    var copyBtn = $('#copy');
    if (copyBtn) { copyBtn.setAttribute('data-copy-label', m['site.contact.copy'] || ''); copyBtn.setAttribute('data-copied', m['site.contact.copied'] || ''); }
    current = lang;
  }
  function setLang(lang) {
    if (lang === current) return;
    if (!dict.pt) dict.pt = snapshotPt();
    if (lang === 'en' && !dict.en) {
      fetch('/i18n/en.json').then(function (r) { return r.json(); }).then(function (j) { dict.en = j; apply('en'); store.set('lang', 'en'); })
        .catch(function () { /* fica em PT */ });
      return;
    }
    apply(lang); store.set('lang', lang);
  }
  $$('.lang-btn').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); }); });
  var q = new URLSearchParams(location.search).get('lang');
  var saved = q || store.get('lang');
  if (!saved && (navigator.language || '').toLowerCase().indexOf('pt') !== 0) saved = 'en';
  if (saved === 'en') setLang('en');

  /* ---------- nav: scroll, menu mobile, scroll-spy ---------- */
  var nav = $('.nav'), menuBtn = $('#menu-btn'), menu = $('#menu');
  function onScrollNav() { nav.classList.toggle('scrolled', w.scrollY > 24); }
  onScrollNav(); w.addEventListener('scroll', onScrollNav, { passive: true });
  function closeMenu() { root.classList.remove('menu-open'); if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false'); }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = root.classList.toggle('menu-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }
  var spyLinks = $$('[data-spy]');
  var sections = spyLinks.map(function (a) { return $('#' + a.getAttribute('data-spy')); }).filter(Boolean);
  function spy() {
    var y = w.scrollY + w.innerHeight * 0.38, cur = null;
    sections.forEach(function (s) { if (s.offsetTop <= y) cur = s.id; });
    spyLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-spy') === cur); });
  }
  spy(); w.addEventListener('scroll', spy, { passive: true }); w.addEventListener('resize', spy);

  /* ---------- reveal on scroll ---------- */
  var rv = $$('.rv');
  if (reduce || !('IntersectionObserver' in w)) { rv.forEach(function (n) { n.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (n) {
      if (n.getBoundingClientRect().top < w.innerHeight * 0.9) n.classList.add('in'); else io.observe(n);
    });
  }

  /* ---------- timeline: linha que acende ---------- */
  var tl = $('#tl');
  if (tl) {
    var items = $$('.tl-item', tl);
    function tlProgress() {
      var r = tl.getBoundingClientRect(), focus = w.innerHeight * 0.55;
      var p = Math.min(1, Math.max(0, (focus - r.top) / r.height));
      tl.style.setProperty('--p', p.toFixed(3));
      items.forEach(function (it) { it.classList.toggle('lit', it.getBoundingClientRect().top < focus); });
    }
    tlProgress(); w.addEventListener('scroll', tlProgress, { passive: true }); w.addEventListener('resize', tlProgress);
  }

  /* ---------- tilt suave nos painéis (só mouse) ---------- */
  if (fine && !reduce) {
    $$('[data-tilt]').forEach(function (el) {
      var raf = 0, rx = 0, ry = 0;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
        rx = (0.5 - (e.clientY - r.top) / r.height) * 4;
        if (!raf) raf = requestAnimationFrame(function () { el.style.transform = 'perspective(1100px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)'; raf = 0; });
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- copiar e-mail ---------- */
  var copyBtn = $('#copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var val = copyBtn.getAttribute('data-copy'), label = $('span', copyBtn);
      var done = function () {
        copyBtn.classList.add('ok'); label.textContent = copyBtn.getAttribute('data-copied');
        setTimeout(function () { copyBtn.classList.remove('ok'); label.textContent = copyBtn.getAttribute('data-copy-label'); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(val).then(done, function () { location.href = 'mailto:' + val; });
      else location.href = 'mailto:' + val;
    });
  }

  /* ---------- console do hero: linhas entram uma a uma e reciclam ---------- */
  var con = $('#console');
  if (con && !reduce) {
    var lines = $$('.console-lines li', con), i = 0, shown = 0, max = 5;
    lines.forEach(function (l) { l.classList.add('hide'); });
    function next() {
      var l = lines[i % lines.length];
      l.classList.remove('hide'); l.classList.add('typed');
      con.querySelector('.console-lines').appendChild(l); // move para o fim (ordem visual)
      shown++;
      if (shown > max) { var first = $('.console-lines li:not(.hide)', con); if (first && first !== l) first.classList.add('hide'); shown--; }
      i++;
      setTimeout(next, 1400 + Math.random() * 900);
    }
    var start = function () { if (!con.dataset.on) { con.dataset.on = '1'; setTimeout(next, 500); } };
    if ('IntersectionObserver' in w) { var cio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { start(); cio.disconnect(); } }); }); cio.observe(con); }
    else start();
  }

  /* ---------- ticker: duplica a trilha para loop contínuo ---------- */
  var track = $('.ticker-track');
  if (track) { track.innerHTML += '<i>·</i>' + track.innerHTML; }
})();
