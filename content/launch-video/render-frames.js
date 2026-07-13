const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

const W = 3840, H = 2160, FPS = 24, DUR = 12;
const FRAMES = FPS * DUR;                 // 288
const DIR = path.resolve('frames');
fs.mkdirSync(DIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args:['--no-sandbox','--disable-gpu','--force-color-profile=srgb','--font-render-hinting=none','--hide-scrollbars']
  });
  const page = await browser.newPage({ viewport:{width:W,height:H}, deviceScaleFactor:1 });
  await page.goto('file://'+path.resolve('launch.html'));
  await page.waitForFunction('window.__ready===true');
  await page.evaluate(()=>document.fonts.ready);

  const t0 = Date.now();
  for (let f = 0; f < FRAMES; f++){
    const t = f / FPS;
    await page.evaluate(t => window.seek(t), t);
    const file = path.join(DIR, 'f_' + String(f).padStart(4,'0') + '.jpg');
    await page.screenshot({ path: file, type:'jpeg', quality: 95 });
    if (f % 12 === 0 || f === FRAMES-1){
      const el = (Date.now()-t0)/1000;
      console.log(`RENDER frame ${f+1}/${FRAMES}  t=${t.toFixed(2)}s  elapsed=${el.toFixed(0)}s`);
    }
  }
  await browser.close();
  console.log('RENDER-DONE ' + FRAMES + ' frames');
})().catch(e => { console.error('RENDER-ERROR', e); process.exit(1); });
