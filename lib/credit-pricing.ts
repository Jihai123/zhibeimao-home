import { usdCnyReference } from '@/data/api-product';

export type CreditSavings = {
  referenceCny: string;
  pricePerDollarCny: string;
  discountFold: string;
  savingsPercent: number;
};

// Purchase discount against USD-denominated credit face value converted at a
// dated reference FX rate. NOT a claim about individual models' API token prices.
export function calculateCreditSavings(usdCredit: number, priceCny: number): CreditSavings {
  if (!Number.isFinite(usdCredit) || !Number.isFinite(priceCny) || usdCredit <= 0 || priceCny <= 0) {
    throw new Error('Credit face value and RMB purchase price must be positive');
  }
  const faceCny = usdCredit * usdCnyReference.rate;
  const paidRatio = priceCny / faceCny;
  return {
    referenceCny: faceCny.toFixed(2),
    pricePerDollarCny: (priceCny / usdCredit).toFixed(2),
    discountFold: (paidRatio * 10).toFixed(1),
    savingsPercent: Math.max(0, Math.round((1 - paidRatio) * 100))
  };
}
