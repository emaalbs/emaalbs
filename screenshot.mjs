import puppeteer from 'puppeteer';

// Cache-bust query string so Next.js image optimizer treats each request as fresh
const bust = Date.now();

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-cache', '--disable-application-cache', '--disable-offline-load-stale-cache', '--disk-cache-size=0'],
});

const devices = [
  { name: 'desktop', width: 1440, height: 900, scale: 1 },
  { name: 'mobile', width: 390, height: 844, scale: 2 },
];

for (const device of devices) {
  const page = await browser.newPage();
  // Disable all caching for this page
  await page.setCacheEnabled(false);
  await page.setExtraHTTPHeaders({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  });
  await page.setViewport({ width: device.width, height: device.height, deviceScaleFactor: device.scale });
  await page.goto(`http://localhost:3000/?_cb=${bust}`, { waitUntil: 'load' });

  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 200);
    });
  });

  await new Promise((r) => setTimeout(r, 5000));

  await page.screenshot({ path: `preview-${device.name}.png`, fullPage: true });
  console.log(`Done → preview-${device.name}.png`);
}

await browser.close();