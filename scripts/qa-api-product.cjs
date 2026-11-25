const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const canonical = 'https://www.zhibeimao.com';
const preview = 'https://zhibeimao-home-1hddvx7pg-liuweis-projects.vercel.app';
const helpwork = 'https://helpwork.zhibeimao.com';
const baidu = 'https://hm.baidu.com/hm.js?8dbf8b58ca53a47a0654705d5db34f60';

async function observe(browser, origin, pathname, expectBaidu) {
  const page = await browser.newPage();
  const requests = [];
  try {
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.hostname === 'hm.baidu.com') requests.push(url.origin + url.pathname + (url.pathname === '/hm.js' ? url.search : ''));
    });
    await page.route('**://hm.baidu.com/**', async (route) => {
      if (origin === canonical && route.request().url() === baidu) {
        const response = await route.fetch({ timeout: 20000 });
        console.log('Baidu upstream', response.status(), baidu);
        await route.fulfill({ response, body: '' });
      } else {
        await route.fulfill({ contentType: 'application/javascript', body: '' });
      }
    });
    const [response, script] = await Promise.all([
      page.goto(origin + pathname, { waitUntil: 'load', timeout: 45000 }),
      expectBaidu ? page.waitForResponse(baidu, { timeout: 45000 }) : null
    ]);
    if (origin === helpwork && requests.length === 0) {
      await page.waitForResponse((request) => request.url().startsWith('https://hm.baidu.com/'), { timeout: 3000 }).catch(() => {});
    }
    const evidence = await page.evaluate(() => ({
      title: document.title,
      rootTag: !!document.querySelector('#baidu-tongji'),
      inlineMatches: Array.from(document.scripts).filter((script) => !script.src).flatMap((script) =>
        Array.from(script.textContent.matchAll(/hm\.baidu\.com\/hm\.js\?[a-f0-9]+/g), (match) => match[0])
      ),
      installedTags: Array.from(document.scripts).map((script) => script.src).filter((url) => url.startsWith('https://hm.baidu.com/'))
    }));
    console.log('LIVE', JSON.stringify({ origin, final: page.url(), status: response.status(), requests, evidence }));
    if (expectBaidu) {
      assert.equal(response.status(), 200);
      assert.equal(script.status(), 200);
      assert.deepEqual(requests, [baidu]);
      assert.equal(evidence.rootTag, true);
    }
  } finally {
    await page.unrouteAll({ behavior: 'wait' });
    await page.close();
  }
}

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-sandbox'] });
  try {
    await observe(browser, helpwork, '/', false);
    await observe(browser, preview, '/about', false);
    const apex = await fetch('https://zhibeimao.com/about?utm_source=qa', { redirect: 'manual', signal: AbortSignal.timeout(15000) });
    console.log('APEX', apex.status, apex.headers.get('location'));
    assert([301, 302, 307, 308].includes(apex.status));
    assert.equal(apex.headers.get('location'), canonical + '/about?utm_source=qa');
    for (let attempt = 0; attempt < 36; attempt++) {
      try {
        const res = await fetch(canonical + '/about', { signal: AbortSignal.timeout(15000) });
        const html = await res.text();
        if (res.ok && html.includes('window.location.hostname !==')) {
          await observe(browser, canonical, '/about', true);
          return;
        }
      } catch (error) {
        console.log('Live probe attempt', attempt + 1, error.message);
      }
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
    throw new Error('Canonical site did not serve the expected deployed analytics guard and script');
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
