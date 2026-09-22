// src/cv/cv.mjs — currículo em HTML (A4) para conferência e impressão em PDF (scripts/pdf.mjs)
import { esc } from '../render.mjs';

const LINK_HREF = {
  'jrkrz.xyz': 'https://jrkrz.xyz',
  'github.com/juniorkrz': 'https://github.com/juniorkrz',
  'linkedin.com/in/junior-krz': 'https://www.linkedin.com/in/junior-krz/',
  'jrrobertokrz@gmail.com': 'mailto:jrrobertokrz@gmail.com',
};

export function renderCv(cv, lang) {
  const L = cv.labels;
  const link = (s) => `<a href="${esc(LINK_HREF[s] || (s.startsWith('http') ? s : 'https://' + s))}">${esc(s)}</a>`;
  const projLink = (u) => u ? `<a class="pl" href="${esc(u.startsWith('http') ? u : 'https://' + u)}">${esc(u.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a>` : '';
  return `<!doctype html>
<html lang="${lang === 'pt' ? 'pt-BR' : 'en'}">
<head>
<meta charset="utf-8">
<title>${esc(cv.name)} · CV</title>
<meta name="robots" content="noindex">
<style>
@font-face{font-family:Manrope;src:url(../assets/fonts/manrope-var.woff2) format("woff2");font-weight:200 800;font-display:block}
@font-face{font-family:Syne;src:url(../assets/fonts/syne-var.woff2) format("woff2");font-weight:400 800;font-display:block}
@font-face{font-family:"JetBrains Mono";src:url(../assets/fonts/jetbrains-mono-var.woff2) format("woff2");font-weight:400 800;font-display:block}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff;color:#1A1330;font-family:Manrope,system-ui,sans-serif;font-size:9.6pt;line-height:1.42;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;min-height:297mm;padding:13mm 14mm 12mm;margin:0 auto;position:relative}
.page::before{content:"";position:absolute;left:0;top:0;right:0;height:4mm;background:linear-gradient(90deg,#5B21B6,#8B5CF6 55%,#C4B5FD)}
header{display:flex;justify-content:space-between;align-items:flex-end;gap:8mm;border-bottom:1.5px solid #E6E0F5;padding-bottom:3.5mm;margin-bottom:4mm}
h1{font-family:Syne,sans-serif;font-size:20pt;letter-spacing:-.02em;line-height:1.05}
h1 em{color:#6D28D9;font-style:normal}
.hl{font-family:"JetBrains Mono",monospace;font-size:8.2pt;color:#6D28D9;text-transform:uppercase;letter-spacing:.08em;margin-top:1.5mm}
.loc{color:#4D4370;margin-top:1mm}
.links{text-align:right;font-family:"JetBrains Mono",monospace;font-size:7.8pt;line-height:1.7}
.links a{color:#1A1330;text-decoration:none}
h2{font-family:"JetBrains Mono",monospace;font-size:7.6pt;text-transform:uppercase;letter-spacing:.14em;color:#6D28D9;display:flex;align-items:center;gap:3mm;margin:4mm 0 2mm}
h2::after{content:"";flex:1;height:1px;background:#E6E0F5}
p.sum{color:#2A2145;text-align:justify}
.job{margin-bottom:2.6mm}
.job-h{display:flex;justify-content:space-between;gap:4mm;align-items:baseline}
.job-h b{font-weight:700;font-size:10.2pt}
.job-h span{color:#4D4370}
.job-h .per{font-family:"JetBrains Mono",monospace;font-size:7.6pt;color:#7B7196;white-space:nowrap}
ul{list-style:none;margin-top:1mm}
ul li{position:relative;padding-left:3.6mm;margin:.5mm 0}
ul li::before{content:"";position:absolute;left:0;top:.62em;width:1.6mm;height:1.6mm;border-radius:50%;background:#8B5CF6}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:2.4mm 6mm}
.proj:last-child:nth-child(odd){grid-column:1/-1}
h2{break-after:avoid}
.proj{break-inside:avoid;border:1px solid #E6E0F5;border-radius:2mm;padding:2.2mm 2.6mm;background:#FAF8FF}
.proj b{font-size:9.6pt}
.proj .tech{font-family:"JetBrains Mono",monospace;font-size:7.2pt;color:#6D28D9;margin:.6mm 0 .8mm}
.proj p{color:#2A2145}
.proj .pl{display:inline-block;margin-top:.8mm;font-family:"JetBrains Mono",monospace;font-size:7.2pt;color:#4D4370;text-decoration:none}
.skills{display:grid;grid-template-columns:1fr 1fr;gap:1mm 6mm}
.skills div{display:flex;gap:2mm}
.skills b{min-width:30mm;font-weight:700;color:#2A2145}
.edu{display:flex;justify-content:space-between;gap:4mm}
.edu .per{font-family:"JetBrains Mono",monospace;font-size:7.6pt;color:#7B7196;white-space:nowrap}
.two{display:grid;grid-template-columns:1.3fr 1fr;gap:2mm 6mm}
.small{color:#4D4370}
</style>
</head>
<body>
<div class="page">
  <header>
    <div>
      <h1>${esc(cv.name).replace(/(\S+)$/, '<em>$1</em>')}</h1>
      <div class="hl">${esc(cv.headline)}</div>
      <div class="loc">${esc(cv.location)}</div>
    </div>
    <div class="links">${cv.links.map(link).join('<br>')}</div>
  </header>

  <h2>${esc(L.summary)}</h2>
  <p class="sum">${esc(cv.summary)}</p>

  <h2>${esc(L.experience)}</h2>
  ${cv.experience.map((j) => `
  <div class="job">
    <div class="job-h"><div><b>${esc(j.role)}</b> <span>· ${esc(j.company)}</span></div><span class="per">${esc(j.period)}</span></div>
    <ul>${j.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  </div>`).join('')}

  <h2>${esc(L.skills)}</h2>
  <div class="skills">${cv.skills.map((s) => `<div><b>${esc(s.group)}</b><span>${esc(s.items)}</span></div>`).join('')}</div>

  <h2>${esc(L.projects)}</h2>
  <div class="grid2">${cv.projects.map((p) => `
    <div class="proj"><b>${esc(p.name)}</b><div class="tech">${esc(p.tech)}</div><p>${esc(p.text)}</p>${projLink(p.link)}</div>`).join('')}
  </div>

  <div class="two">
    <div>
      <h2>${esc(L.education)}</h2>
      ${cv.education.map((e) => `<div class="edu"><div><b>${esc(e.title)}</b><div class="small">${esc(e.org)}</div></div><span class="per">${esc(e.period)}</span></div>`).join('')}
      <h2>${esc(L.courses)}</h2>
      <ul>${cv.courses.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
    </div>
    <div>
      <h2>${esc(L.ai)}</h2>
      <p class="small">${esc(cv.ai)}</p>
      <h2>${esc(L.languages)}</h2>
      <ul>${cv.languages.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
    </div>
  </div>
</div>
</body>
</html>
`;
}
