// 업체 전용판 만들기: shops/<id>.json → <id>/index.html · manifest · sw.js
// 루트 index.html을 고친 뒤에는 꼭 `node tools/build.mjs`를 다시 돌려 전용판에도 반영할 것.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const swBase = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const must = (html, a) => { if (!html.includes(a)) throw new Error('index.html에서 못 찾음: ' + a); };

for (const f of fs.readdirSync(path.join(root, 'shops')).filter(f => f.endsWith('.json'))) {
  const shop = JSON.parse(fs.readFileSync(path.join(root, 'shops', f), 'utf8'));
  const dir = path.join(root, shop.id);
  fs.mkdirSync(dir, { recursive: true });

  const preset = { id: shop.id, appName: shop.appName, contract: !!shop.contract, types: shop.types, settings: shop.settings, items: shop.items || [], old: shop.old || {} };
  let html = base;
  for (const a of ['<title>간편 견적서</title>', 'content="간편 견적서">', '<h1 id="topTitle">간편 견적서</h1>']) must(html, a);
  html = html
    .replace('<title>간편 견적서</title>', `<title>${shop.appName} (간편 견적서)</title>\n<meta name="robots" content="noindex">`)
    .replace('content="간편 견적서">', `content="${shop.shortName}">`)
    .replace('<h1 id="topTitle">간편 견적서</h1>', `<h1 id="topTitle">${shop.appName}</h1>`)
    .replace(/<script>(\s*)'use strict';/, `<script>window.EQ_PRESET = ${JSON.stringify(preset)};</script>\n<script>$1'use strict';`);
  if (!html.includes('window.EQ_PRESET')) throw new Error('PRESET 넣기 실패');
  fs.writeFileSync(path.join(dir, 'index.html'), html);

  fs.writeFileSync(path.join(dir, 'manifest.webmanifest'), JSON.stringify({
    name: `${shop.appName} 견적서`, short_name: shop.shortName, start_url: './', scope: './',
    display: 'standalone', background_color: '#f3f1ec', theme_color: '#1f4e8c',
    icons: [
      { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  }, null, 2));
  let sw = swBase.replace(/const CACHE = '[^']*'/, `const CACHE = 'easy-quote-${shop.id}-v1'`);
  const st = shop.settings.stamp;              // 기본 도장(업체 폴더의 png)도 오프라인용으로 저장
  if (st && !st.startsWith('data:')) {
    if (!fs.existsSync(path.join(dir, st))) throw new Error('도장 파일 없음: ' + shop.id + '/' + st);
    sw = sw.replace("'./icon-180.png'];", `'./icon-180.png', './${st}'];`);
    if (!sw.includes(st)) throw new Error('sw.js에 도장 넣기 실패');
  }
  fs.writeFileSync(path.join(dir, 'sw.js'), sw);
  for (const s of [180, 192, 512]) {            // 전용 아이콘이 없으면 기본 아이콘을 씀 (tools/make-icons.ps1)
    const icon = path.join(dir, `icon-${s}.png`);
    if (!fs.existsSync(icon)) fs.copyFileSync(path.join(root, `icon-${s}.png`), icon);
  }
  console.log(`만듦: ${shop.id}/  (${shop.appName})`);
}
