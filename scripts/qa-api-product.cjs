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

  // Validate SEO discovery endpoints against the same Next production preview
  // used for the rest of the browser regression.
  const robotsResponse = await fetch(base + '/robots.txt');
  assert.equal(robotsResponse.status, 200, 'SEO robots.txt must return HTTP 200');
  const robotsBody = await robotsResponse.text();
  assert.match(robotsBody, /Sitemap:\s*https:\/\/www\.zhibeimao\.com\/sitemap\.xml/, 'robots.txt must advertise the canonical sitemap');

  const sitemapResponse = await fetch(base + '/sitemap.xml');
  assert.equal(sitemapResponse.status, 200, 'SEO sitemap.xml must return HTTP 200');
  const sitemapBody = await sitemapResponse.text();
  for (const pagePath of ['/', '/api', '/api/docs', '/about']) {
    assert(sitemapBody.includes('<loc>https://www.zhibeimao.com' + pagePath + '</loc>'),
      'sitemap.xml is missing canonical URL: ' + pagePath);
  }
  console.log('PASS: SEO discovery endpoints and four canonical sitemap URLs');
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
      assert.equal(await homeDirect.locator('a[href^="https://online.chatgpt5x.com/"]').count(), 1, 'unified panel purchase link missing');
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
      for (const forbidden of [
        'HTTP 200 已实测', '已完成的实际验证', '反代', '临时域名',
        '待逐项验证', '上游扣费', '较新版本优先', '117 个型号',
        'API ID（含不同线路）', '分档计费', '复杂计费'
      ]) {
        assert.equal(publicCopy.includes(forbidden), false, 'customer-facing copy contains internal or unclear language: ' + forbidden);
      }

      const sectionOrder = await page.locator('main').evaluate((main) =>
        Array.from(main.querySelectorAll('#pricing, #models')).map((section) => section.id)
      );
      assert.deepEqual(sectionOrder, ['pricing', 'models'], 'credit offers should appear before model prices');

      const overview = page.locator('aside[aria-label="API 接入概览"]');
      const modelNav = overview.getByRole('link', { name: '跳转到模型列表和价格' });
      const quickCallNav = overview.getByRole('link', { name: '打开快速调用示例' });
      assert.equal(await modelNav.getAttribute('href'), '#models', 'model overview card should link to model catalog');
      assert.equal(await quickCallNav.getAttribute('href'), '/api/docs#first-call', 'quick call overview card should link to code examples');

      const pricing = page.locator('#pricing');
      assert(await pricing.getByRole('heading', { name: '美元 API 额度，人民币优惠购买' }).isVisible(), 'credit pricing must remain visible');
      const catalog = page.locator('#models');
      assert(await catalog.getByRole('heading', { name: '模型目录与调用价格' }).isVisible(), 'model pricing catalog must exist');
      assert(await catalog.getByText(/价格单位说明/).isVisible(), 'model price unit explanation must be visible');
      assert(await catalog.getByText(/不是人民币价格/).first().isVisible(), 'quota unit must not be confused with RMB prices');
      assert(await catalog.getByText(/每百万 Token/).first().isVisible(), 'token price unit must be clear');
      assert(await catalog.getByRole('searchbox', { name: '搜索模型' }).isVisible(), 'model search must exist');

      const modelRows = catalog.locator('.divide-y > article');
      assert.equal(await modelRows.count(), 10, 'the first view should show exactly ten models');
      assert.equal(await catalog.locator('article h3').count(), 0, 'duplicated featured model cards should be removed');

      const firstGroup = modelRows.first();
      await firstGroup.locator('summary').click();
      assert.equal(await firstGroup.locator('details[open]').count(), 1, 'model details should expand');
      assert(await firstGroup.getByText(/⚡表示模型调用时消耗的额度单位/).count() > 0, 'expanded pricing unit explanation missing');
      assert.equal((await firstGroup.innerText()).includes('标准上下文上下文'), false, 'tier label and context condition must not be duplicated');

      await catalog.getByRole('searchbox', { name: '搜索模型' }).fill('qwen3-vl-plus');
      const qwenRow = catalog.locator('.divide-y > article').filter({ hasText: 'qwen3-vl-plus' });
      assert.equal(await qwenRow.count(), 1, 'search should find Qwen VL Plus');
      const qwenText = await qwenRow.innerText();
      assert(qwenText.includes('上下文 < 200,000 Token'), 'tiered model should explain the short-context price band');
      assert(qwenText.includes('上下文 ≥ 200,000 Token'), 'tiered model should explain the long-context price band');
      assert(qwenText.includes('⚡1.5') && qwenText.includes('⚡15'), 'tiered model should show input and output prices directly');
      assert.equal(qwenText.includes('分档计费'), false, 'unclear tiered billing badge must not be shown');

      await catalog.getByRole('searchbox', { name: '搜索模型' }).fill('kimi-k3.1-pro-highspeed');
      const kimiRow = catalog.locator('.divide-y > article').filter({ hasText: 'kimi-k3.1-pro-highspeed' });
      assert.equal(await kimiRow.count(), 1, 'search should find Kimi high-speed model');
      const kimiText = await kimiRow.innerText();
      assert(kimiText.includes('⚡13') && kimiText.includes('⚡68'), 'single-tier billing expression should show input and output prices directly');

      await catalog.getByRole('searchbox', { name: '搜索模型' }).fill('glm-5.3');
      const glmRow = catalog.locator('.divide-y > article').filter({ hasText: 'glm-5.3' });
      assert.equal(await glmRow.count(), 1, 'search should find GLM 5.3');
      const glmText = await glmRow.innerText();
      assert(glmText.includes('⚡4') && glmText.includes('⚡14'), 'flat token pricing should remain directly visible');

      await catalog.getByRole('searchbox', { name: '搜索模型' }).fill('grok-imagine-video-1.5');
      const videoRow = catalog.locator('.divide-y > article').filter({ hasText: 'grok-imagine-video-1.5' });
      assert.equal(await videoRow.count(), 1, 'search should find video model');
      assert((await videoRow.innerText()).includes('⚡0.08 / 秒'), 'video billing should show per-second price');

      await catalog.getByRole('searchbox', { name: '搜索模型' }).fill('');
      await catalog.getByRole('button', { name: 'Claude', exact: true }).click();
      assert.equal(await catalog.getByRole('button', { name: 'Claude', exact: true }).getAttribute('aria-pressed'), 'true');
      assert.equal(await modelRows.count(), 10, 'filter should also limit first view to ten models');
      await catalog.getByRole('button', { name: '全部', exact: true }).click();
      await catalog.getByRole('button', { name: '显示更多模型' }).click();
      assert.equal(await modelRows.count(), 20, 'show more should add ten models');

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
      assert(await pricing.locator('a[href^="https://online.chatgpt5x.com/"]').count() >= 3);
      await page.waitForFunction(() => {
        const a = document.querySelector('#pricing a[aria-label*="美元额度，人民币"]');
        return a && a.getAttribute('href')?.includes('utm_source=zhibeimao');
      }, null, { timeout: 5000 });
      const outbound = await pricing.locator('a[aria-label*="美元额度，人民币"]').first().getAttribute('href');
      assert(outbound.includes('utm_campaign=api_key_sales'), 'store attribution campaign must pass through');
      assert(outbound.includes('zbm_placement=api_plan_'), 'store checkout placement must pass through');


      await page.screenshot({ path: path.join(output, 'api-' + width + '.png'), fullPage: true });

      await modelNav.click();
      await page.waitForFunction(() => window.location.hash === '#models');
      await quickCallNav.click();
      await page.waitForURL('**/api/docs#first-call');
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

      // A visitor referred by chatgpt5x must keep the FIRST site and placement
      // when landing on this site and going on to the standalone Key store.
      if (width === 1280) {
        await visit(page, '/api?utm_source=chatgpt5x&utm_medium=referral&utm_campaign=api_key_sales&utm_content=nav_dropdown', 'attribution-api');
        const offerLink = page.locator('#pricing a[aria-label*="美元额度，人民币"]').first();
        await page.waitForFunction(() => {
          const anchor = document.querySelector('#pricing a[aria-label*="美元额度，人民币"]');
          return anchor && anchor.getAttribute('href')?.includes('utm_source=chatgpt5x');
        }, null, { timeout: 5000 });
        const taggedHref = await offerLink.getAttribute('href');
        assert(taggedHref.includes('utm_content=nav_dropdown'), 'original referral placement must survive');
        assert(taggedHref.includes('zbm_placement=api_plan_'), 'checkout placement must survive');
        await visit(page, '/api/docs', 'attribution-docs');
        await page.waitForFunction(() => {
          const link = document.querySelector('main a[href^="https://online.chatgpt5x.com/"]');
          return link && link.getAttribute('href')?.includes('utm_source=chatgpt5x');
        }, null, { timeout: 5000 });
        const docsTagged = await page.locator('main a[href^="https://online.chatgpt5x.com/"]').first().getAttribute('href');
        assert(docsTagged.includes('utm_content=nav_dropdown'), 'first referral attribution lost on internal navigation');
      }
      await page.close();
    }
    console.log('PASS: customer-focused API pricing, model navigation and responsive browser regression');
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
