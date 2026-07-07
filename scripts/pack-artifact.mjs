// Post-processes the single-file Vite build (dist-artifact/index.html) into a
// fully self-contained HTML with every asset inlined as a data URI — suitable
// for publishing as a Claude Artifact (strict CSP, no external hosts).
//
//   npm run build:artifact   →   dist-artifact/connect-app.html
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'dist-artifact'
let html = readFileSync(join(dir, 'index.html'), 'utf8')

// 1) Inline /img/*.jpg referenced at runtime as base64 data URIs.
const imgDir = join(dir, 'img')
for (const fn of readdirSync(imgDir)) {
  const b64 = readFileSync(join(imgDir, fn)).toString('base64')
  const uri = `data:image/jpeg;base64,${b64}`
  html = html.split(`/img/${fn}`).join(uri)
}

// 2) Guard: no fetchable asset URLs should remain (fonts/images must be data URIs).
const leftover = [...html.matchAll(/url\((?!["']?data:)([^)]+)\)/g)]
  .map((m) => m[1])
  .filter((u) => !u.includes('http://www.w3.org') && u.trim() !== '"')
if (leftover.length) {
  console.warn('⚠ non-inlined url() refs remain:', leftover.slice(0, 5))
}

// 3) Emit body-only content (Artifact provides <!doctype>/<head>/<body>).
const styles = html.match(/<style[^>]*>[\s\S]*?<\/style>/g) ?? []
const scripts = html.match(/<script[^>]*>[\s\S]*?<\/script>/g) ?? []
const clean = (t) => t.replace(/ crossorigin/g, '').replace(/<style rel="stylesheet"/g, '<style')

const out = [
  '<title>Connect — Curbside, Elevated.</title>',
  ...styles.map(clean),
  '<div id="root"></div>',
  ...scripts.map(clean),
].join('\n')

const dest = join(dir, 'connect-app.html')
writeFileSync(dest, out)
console.log(`✓ ${dest} — ${(out.length / 1024) | 0} KB, self-contained`)
