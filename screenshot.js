const puppeteer = require('puppeteer');
const path = require('path');

const URL = 'file://' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');

const SHOTS = [
  { name: 'desktop',       width: 1440, height: 900  },
  { name: 'tablet',        width: 768,  height: 1024 },
  { name: 'mobile',        width: 390,  height: 844  },
];

(async () => {
  const browser = await puppeteer.launch();
  const page    = await browser.newPage();

  for (const shot of SHOTS) {
    await page.setViewport({ width: shot.width, height: shot.height });
    await page.goto(URL, { waitUntil: 'networkidle0' });

    // Full-page screenshot
    const file = `screenshot-${shot.name}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(`Saved: ${file}`);
  }

  await browser.close();
})();
