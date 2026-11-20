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
      assert(await homeDirect.getByRole('heading', { name: /在线体验与 API 接入/ }).isVisible());
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
      const publicCopy = await page.locator('main').innerText();
      for (const forbidden of ['HTTP 200 已实测', '已完成的实际验证', '反代', '临时域名', '待逐项验证', '上游扣费']) {
        assert.equal(publicCopy.includes(forbidden), false, 'customer-facing copy contains internal language: ' + forbidden);
      }
      const pricing = page.locator('#pricing');
      assert(await pricing.getByRole('heading', { name: '美元 API 额度，人民币优惠购买' }).isVisible(), 'credit pricing must remain visible');
      const catalog = page.locator('#models');
      assert(await catalog.getByRole('heading', { name: '模型目录与调用价格' }).isVisible(), 'model pricing catalog must exist');
      assert(await catalog.getByText(/个模型/).isVisible(), 'unique model count must be visible');
      assert(await catalog.getByText(/个 API ID/).isVisible(), 'API ID count must be visible');
      assert(await catalog.getByText(/⚡/).count() > 0, 'catalog prices must be rendered');
      assert(await catalog.getByRole('searchbox', { name: '搜索模型' }).isVisible(), 'model search must exist');
      const featured = catalog.locator('article h3');
      assert.equal(await featured.count(), 8, 'eight featured model cards are expected');
      const featuredIds = (await featured.allTextContents()).map((id) => id.trim());
      assert(featuredIds.every((id) => id && !id.includes('/')), 'featured cards must not show channel aliases');
      const firstGroup = catalog.locator('article').filter({ has: catalog.locator('summary') }).first();
      if (await firstGroup.count()) {
        await firstGroup.locator('summary').click();
        assert(await firstGroup.locator('details[open]').count() === 1, 'model details should expand');
      }
      await catalog.getByRole('searchbox', { name: '搜索模型' }).fill('gpt-6.2-sol');
      assert(await catalog.getByText('gpt-6.2-sol', { exact: true }).count() >= 1, 'search must find canonical model names');
      await catalog.getByRole('searchbox', { name: '搜索模型' }).fill('');
      await catalog.getByRole('button', { name: 'Claude', exact: true }).click();
      assert.equal(await catalog.getByRole('button', { name: 'Claude', exact: true }).getAttribute('aria-pressed'), 'true');
      assert(await catalog.getByText(/⚡ \/ 百万 Token/).count() > 0, 'price unit disclaimer missing');

      assert(await page.getByRole('heading', { name: /一个 Key/ }).isVisible());
      assert.equal(await page.locator('#direct-use').count(), 0, 'API product page must not repeat the online-tools section');
      for (const site of ['librechat.chatgpt5x.com', 'art.chatgpt5x.com', 'aiview.chatgpt5x.com']) {
        assert.equal((await page.locator('main').innerText()).includes(site), false, 'API product content must remain API-only: ' + site);
      }
      assert.equal(await page.getByRole('link', { name: /查看接入文档/ }).count() >= 1, true, 'API docs CTA missing');
      assert.equal(await page.locator('code').filter({ hasText: 'https://api.zhibeimao.com/v1' }).count() >= 1, true, 'API Base URL missing');
      assert.equal(await pricing.locator('a[aria-label*="美元额度，人民币"]').count(), 3, 'expect three credit offers');
      for (const [amount, price, fold, percent] of [['3', '10', '5.0', '50'], ['10', '30', '4.5', '55'], ['20', '55', '4.1', '59']]) {
        const offer = pricing.locator('a[aria-label^="' + amount + ' 美元额度，人民币"]');
        assert.equal(await offer.count(), 1, 'missing credit offer for amount ' + amount);
        const label = await offer.getAttribute('aria-label');
        assert(label.includes('人民币 ' + price + ' 元'), 'wrong RMB price for credit amount ' + amount);
        const flatText = (await offer.innerText()).replace(/\s+/g, '');
        assert(flatText.includes('约' + fold + '折'), 'missing discount fold for ' + amount);
        assert(flatText.includes('约省' + percent + '%'), 'missing discount saving for ' + amount);
      }
      assert(await pricing.getByText(/不代表各模型调用费用比官方 API 便宜相同比例/).isVisible(), 'credit savings caveat missing');
      assert(await pricing.getByText(/参考汇率：2026-11-20/).isVisible(), 'dated exchange rate note missing');
      assert(await pricing.locator('a[href="https://online.chatgpt5x.com/"]').count() >= 3);
      await page.screenshot({ path: path.join(output, 'api-' + width + '.png'), fullPage: true });

      await visit(page, '/api/docs', 'docs-' + width);
      const docsCopy = await page.locator('main').innerText();
      for (const forbidden of ['HTTP 200 已实测', '待逐项验证', '反代', '项目临时域名', '验收']) {
        assert.equal(docsCopy.includes(forbidden), false, 'documentation contains internal language: ' + forbidden);
      }
      assert.equal(await page.locator('pre').count() >= 3, true, 'expected curl, Python and model query examples');
      assert.equal(await page.locator('#no-code-title').count(), 0, 'API docs must not show online tool cards');
      assert.equal(await page.getByRole('heading', { name: /接入配置/ }).count() >= 1, true, 'API configuration section missing');
      await page.getByText('更多接口路径参考').click();
      assert(await page.getByText('/v1/responses').isVisible(), 'additional API protocol reference should expand');
      const docsWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(docsWidth <= width + 2, 'expanded API docs must not overflow viewport');
      await page.screenshot({ path: path.join(output, 'docs-' + width + '.png'), fullPage: true });
      await page.close();
    }
    console.log('PASS: responsive API product, pricing catalog and docs browser regression');
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
