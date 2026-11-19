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
  assert(widths.document <= widths.inner + 2, label + ': horizontal document overflow ' + JSON.stringify(widths));
  assert(widths.body <= widths.inner + 2, label + ': horizontal body overflow ' + JSON.stringify(widths));
  assert.deepEqual(errors, [], label + ': uncaught page exceptions');
  console.log('PASS', label, widths);
}

async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    for (const width of [320, 390, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 844 }, deviceScaleFactor: 1 });
      const isMobile = width < 768;

      await visit(page, '/', 'home-' + width);
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
      assert.equal(await page.locator('#models article').count(), 8, 'expected eight model cards');
      assert(await page.getByRole('heading', { name: /热门与新模型/ }).isVisible());
      assert(await page.locator('#pricing').getByText('3 美元额度通用 Key').isVisible());
      assert(await page.locator('#pricing a[href="https://online.chatgpt5x.com/"]').count() >= 3);
      await page.screenshot({ path: path.join(output, 'api-' + width + '.png'), fullPage: true });

      await visit(page, '/api/docs', 'docs-' + width);
      assert.equal(await page.locator('pre').count() >= 3, true, 'expected curl, Python and model query examples');
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
