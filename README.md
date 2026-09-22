# jrkrz.xyz

Portfólio de **Antônio Roberto Júnior**, desenvolvedor full stack em Recife. No ar em [jrkrz.xyz](https://jrkrz.xyz).

Site estático, sem framework e sem dependências npm: HTML gerado por um script Node, CSS com tokens (tema escuro por padrão, claro opcional), JavaScript vanilla, PT-BR/EN, fontes self-hosted, Open Graph, sitemap e currículo em PDF nos dois idiomas.

## Estrutura

```
build.mjs            gera dist/ (HTML + i18n/en.json + sitemap/robots/manifest + 404 + CV em HTML)
src/render.mjs       template do site (PT no HTML, EN via data-i18n)
src/styles.css       design system (tokens em :root, tema claro em [data-theme="light"])
src/app.js           tema, idioma, menu, scroll-spy, reveal, timeline, tilt, copiar e-mail, console do hero
src/content/*.json   todo o texto do site em {pt, en}
src/cv/cv.mjs        currículo A4 (HTML) renderizado em PDF por scripts/pdf.mjs
server/server.js     servidor estático Node (headers de segurança, CSP, redirects), usado em produção com pm2
assets/              fontes, imagens, favicon, og.png, cv/*.pdf
.github/workflows    deploy automático no push para main (SSH via Cloudflare Access)
```

## Comandos

```bash
node build.mjs            # build em dist/
node build.mjs --serve    # build + servidor local em http://127.0.0.1:4173
node build.mjs --og       # também renderiza assets/og.png (Edge/Chrome headless)
node scripts/pdf.mjs      # gera assets/cv/*.pdf a partir de dist/cv/*.html
```

## Deploy

`dist/` vai para `/opt/portfolio/public` e `server/server.js` para `/opt/portfolio/server.js` no servidor. O processo `portfolio` roda no pm2 (porta 3939, só em 127.0.0.1) e é exposto por um Cloudflare Tunnel dedicado. O workflow em `.github/workflows/deploy.yml` faz isso a cada push em `main` usando os secrets `SSH_HOST`, `SSH_USER` e `SSH_PRIVATE_KEY`.

## Licença

Código sob MIT. Textos, imagens e identidade visual são do autor.
