const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function loadTypeScript(file, imports = {}) {
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', js)((id) => {
    if (!(id in imports)) throw new Error('Unexpected dependency: ' + id);
    return imports[id];
  }, mod, mod.exports);
  return mod.exports;
}

const product = loadTypeScript('data/api-product.ts');
const pricing = loadTypeScript('lib/credit-pricing.ts', { '@/data/api-product': product });
const { calculateCreditSavings } = pricing;

assert.equal(product.usdCnyReference.rate, 6.67);
assert.equal(product.usdCnyReference.asOf, '2026-11-20');
const offers = product.keyOffers.map((offer) => calculateCreditSavings(Number(offer.amount), Number(offer.price)));

assert.deepEqual(offers.map((offer) => offer.referenceCny), ['20.01', '66.70', '133.40']);
assert.deepEqual(offers.map((offer) => offer.pricePerDollarCny), ['3.33', '3.00', '2.75']);
assert.deepEqual(offers.map((offer) => offer.discountFold), ['5.0', '4.5', '4.1']);
assert.deepEqual(offers.map((offer) => offer.savingsPercent), [50, 55, 59]);

assert.throws(() => calculateCreditSavings(0, 10), /positive/);
assert.throws(() => calculateCreditSavings(10, 0), /positive/);
assert.throws(() => calculateCreditSavings(NaN, 10), /positive/);

const pricingSection = fs.readFileSync('components/CreditPricingSection.tsx', 'utf8');
assert(pricingSection.includes('不代表各模型调用费用比官方 API 便宜相同比例'), 'Savings disclaimer is required');
assert(pricingSection.includes('priceCheckedOn'), 'A dated price reference is required');
assert(pricingSection.includes('usdCnyReference.asOf'), 'Dated FX reference is required');
console.log('PASS: three USD-credit RMB offers, dated FX, fold discounts and transparent disclaimers');
