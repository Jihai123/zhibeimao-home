const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const output = path.join(process.cwd(), 'qa-artifacts');

async function visit(page, pathname, label) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto(base + pathname, { waitUntil: 'domcontentloaded', timeout: 30000 });
  assert(response, label + ': missing HTTP response');
  assert.equal(response.status(), 200, label + ': unexpected HTTP status');
  await page.locator('main').waitFor({ state: 'visible' });

  const widths = await page.evaluate(() => ({
    inner: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  if (widths.document > widths.inner + 2 || widths.body > widths.inner + 2) {
    const offenders = await page.evaluate(() => Array.from(document.querySelectorAll('body *'))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          className: String(element.className).slice(0, 115),
          text: (element.textContent || '').trim().slice(0, 55),
          left: Math.round(rect.left),
          right: Math.round(rect.right)
        };
      })
      .filter((item) => item.right > window.innerWidth + 2 && item.left >= -2)
      .sort((a, b) => b.right - a.right)
      .slice(0, 12));
    console.error('OVERFLOW DETAILS', label, JSON.stringify(offenders));
  }
  assert(widths.document <= widths.inner + 2, label + ': horizontal document overflow ' + JSON.stringify(widths));
  assert(widths.body <= widths.inner + 2, label + ': horizontal body overflow ' + JSON.stringify(widths));
  assert.deepEqual(errors, [], label + ': uncaught page exceptions');
  console.log('PASS', label, widths);
}

async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-sandbox'] });
  try {
    for (const width of [320, 390, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 844 }, deviceScaleFactor: 1 });
      const isMobile = width < 768;

      await visit(page, '/', 'home-' + width);
      const homeDirect = page.locator('section[aria-label="指北猫AI直通"]');
      assert(await homeDirect.isVisible(), 'homepage direct-use section should be visible');
      assert.equal(await page.locator('section[aria-label="AI API 开放平台推荐"]').count(), 0, 'duplicate API banner must be absent');
      assert.equal(await page.locator('section[aria-label="指北猫AI直通"]').count(), 1, 'only one unified AI direct section is expected');
      assert(await homeDirect.getByRole('heading', { name: /一个 Key，买完就能直接使用 AI/ }).isVisible());
      assert.equal(await homeDirect.locator('a[href="https://online.chatgpt5x.com/"]').count(), 1, 'unified panel purchase link missing');
      assert.equal(await homeDirect.locator('a[href="https://checkbalance.chatgpt5x.com/"]').count(), 1, 'unified panel balance link missing');
      assert.equal(await homeDirect.locator('a[href="/api"]').count(), 1, 'unified panel API page link missing');
      assert.equal(await homeDirect.locator('a[href="/api/docs"]').count(), 1, 'unified panel developer docs link missing');
      assert.equal(await homeDirect.locator('a[href="https://librechat.chatgpt5x.com/"]').count(), 1, 'homepage LibreChat link missing');
      assert.equal(await homeDirect.locator('a[href="https://art.chatgpt5x.com/"]').count(), 1, 'homepage ArtChat link missing');
      assert.equal(await homeDirect.locator('a[href="https://aiview.chatgpt5x.com/"]').count(), 1, 'homepage AIView link missing');
      if (isMobile) {
        const mobileNav = page.getByRole('navigation', { name: '移动端导航' });
        assert.equal(await mobileNav.isVisible(), false, 'mobile nav should start collapsed');
        await page.locator('summary').getByText('菜单').click();
        assert.equal(await mobileNav.isVisible(), true, 'mobile nav should open');
        await mobileNav.getByRole('link', { name: 'API 接入' }).click();
        await page.waitForURL('**/api');
      } else {
        await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: 'API 接入' }).click();
        await page.waitForURL('**/api');
      }

      await visit(page, '/api', 'api-' + width);
      assert.equal(await page.locator('#models article').count(), 8, 'expected eight model family cards');
      assert(await page.getByRole('heading', { name: /一个 Key/ }).isVisible());
      const directUse = page.locator('#direct-use');
      assert(await directUse.isVisible(), 'API page direct-use section missing');
      assert.equal(await directUse.locator('a[href="https://librechat.chatgpt5x.com/"]').count(), 1, 'API LibreChat link missing');
      assert.equal(await directUse.locator('a[href="https://art.chatgpt5x.com/"]').count(), 1, 'API ArtChat link missing');
      assert.equal(await directUse.locator('a[href="https://aiview.chatgpt5x.com/"]').count(), 1, 'API AIView link missing');
      assert.equal(await directUse.locator('a[href="https://checkbalance.chatgpt5x.com/"]').count(), 1, 'API balance link missing');
      assert(await page.locator('#pricing').getByText('3 美元额度通用 Key').isVisible());
      assert(await page.locator('#pricing a[href="https://online.chatgpt5x.com/"]').count() >= 3);
      await page.screenshot({ path: path.join(output, 'api-' + width + '.png'), fullPage: true });

      await visit(page, '/api/docs', 'docs-' + width);
      assert.equal(await page.locator('pre').count() >= 3, true, 'expected curl, Python and model query examples');
      const docsDirect = page.locator('section').filter({ has: page.locator('#no-code-title') });
      assert.equal(await docsDirect.locator('a[href="https://librechat.chatgpt5x.com/"]').count(), 1, 'docs LibreChat link missing');
      assert.equal(await docsDirect.locator('a[href="https://art.chatgpt5x.com/"]').count(), 1, 'docs ArtChat link missing');
      assert.equal(await docsDirect.locator('a[href="https://aiview.chatgpt5x.com/"]').count(), 1, 'docs AIView link missing');
      await page.screenshot({ path: path.join(output, 'docs-' + width + '.png'), fullPage: true });
      await page.close();
    }
    console.log('PASS: responsive API product and docs browser regression');
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
