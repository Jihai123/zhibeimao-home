import { ArrowRight, ArrowUpRight, BadgePercent } from 'lucide-react';

import { keyOffers, priceCheckedOn, usdCnyReference } from '@/data/api-product';
import { StoreAttributionLink } from '@/components/StoreAttributionLink';
import { calculateCreditSavings } from '@/lib/credit-pricing';

export function CreditPricingSection() {
  const offers = keyOffers.map((offer) => ({
    ...offer,
    savings: calculateCreditSavings(Number(offer.amount), Number(offer.price))
  }));
  const lowestFold = Math.min(...offers.map((offer) => Number(offer.savings.discountFold))).toFixed(1);
  const lowestCost = Math.min(...offers.map((offer) => Number(offer.savings.pricePerDollarCny))).toFixed(2);

  return (
    <section className="mt-16 scroll-mt-24" id="pricing" aria-labelledby="pricing-title">
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-center">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold text-cyan-100">
            <BadgePercent className="h-4 w-4" aria-hidden="true" />
            美元额度低至约 {lowestFold} 折
          </div>
          <h2 id="pricing-title" className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            美元 API 额度，人民币优惠购买
          </h2>
          <p className="mt-4 text-sm leading-8 text-slate-300">
            额度以美元标注，购买只需付人民币。三档套餐明码标价，让你清楚知道每笔钱能买到多少美元额度。
          </p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs text-slate-400">最低每 $1 美元额度的购入成本</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-white">
              ¥{lowestCost}<span className="ml-1 text-sm font-medium text-slate-400">/ $1 额度</span>
            </p>
            <p className="mt-2 text-xs leading-6 text-slate-400">
              按参考汇率 $1 ≈ ¥{usdCnyReference.rate.toFixed(2)} 对比，折扣仅针对额度面值换算。
            </p>
          </div>
          <StoreAttributionLink placement="api_pricing_summary"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
          >
            查看商城实时售价 <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </StoreAttributionLink>
        </div>
        <div className="grid min-w-0 gap-3 sm:grid-cols-3">
          {offers.map((offer, index) => (
            <StoreAttributionLink placement={'api_plan_' + offer.amount}
              key={offer.amount}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={offer.amount + ' 美元额度，人民币 ' + offer.price + ' 元，约 ' + offer.savings.discountFold + ' 折，前往商城'}
              className={'surface-panel group relative flex min-w-0 flex-col rounded-2xl p-5 transition hover:border-cyan-300/40 ' + (index === 2 ? 'ring-1 ring-cyan-300/40' : '')}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-400">{offer.label}</span>
                {index === 2 && (
                  <span className="rounded-full bg-cyan-300/15 px-2 py-1 text-[11px] font-semibold text-cyan-100">更划算</span>
                )}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-100">{offer.amount} 美元额度通用 Key</h3>
              <div className="mt-3 flex items-end gap-1 text-white">
                <span className="pb-1 text-lg font-bold">¥</span>
                <span className="text-4xl font-black tracking-tight">{offer.price}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                面值按参考汇率折合约 ¥{offer.savings.referenceCny}
              </p>
              <div className="mt-3 rounded-lg border border-emerald-300/15 bg-emerald-300/[0.08] px-3 py-2">
                <p className="text-base font-bold text-emerald-200">约 {offer.savings.discountFold} 折</p>
                <p className="mt-0.5 text-xs text-emerald-100/80">相比面值折算约省 {offer.savings.savingsPercent}%</p>
              </div>
              <p className="mt-3 text-xs text-slate-400">每 $1 额度约 ¥{offer.savings.pricePerDollarCny}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-cyan-200 group-hover:text-white">
                查看库存并购买 <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </StoreAttributionLink>
          ))}
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-amber-300/25 bg-amber-300/[0.05] p-4 sm:p-5" role="note" aria-label="API 模型线路费用提醒">
        <h3 className="text-base font-bold text-amber-100">重要：买到优惠额度，不等于每个模型都便宜</h3>
        <p className="mt-2 text-sm leading-7 text-slate-200">
          同一模型可能有三种接入 ID，扣费可能相差数倍。开始调用前请对比输入、输出价格，并复制包含线路前缀的完整模型 ID。
        </p>
        <div className="mt-3 grid gap-2 text-xs leading-6 sm:grid-cols-3">
          <p className="rounded-lg border border-white/10 bg-slate-950/30 px-3 py-2 text-slate-200"><code className="font-bold text-cyan-100">basic/</code> 基础线路：同型号通常较省额度</p>
          <p className="rounded-lg border border-white/10 bg-slate-950/30 px-3 py-2 text-slate-200"><code className="font-bold text-cyan-100">standard/</code> 标准线路：费用通常居中</p>
          <p className="rounded-lg border border-white/10 bg-slate-950/30 px-3 py-2 text-slate-200"><strong className="text-amber-100">无前缀线路：</strong>可能明显更贵，首次使用请特别核对</p>
        </div>
        <p className="mt-3 text-xs leading-6 text-slate-400">
          以上是同名线路的常见差异，不是统一倍率或性能保证；部分模型只有一种线路。实际扣费还可能受上下文长度、缓存、图片或视频计费规则影响。
          <a className="ml-1 font-semibold text-cyan-200 underline underline-offset-4 hover:text-white" href="#models">先对比完整模型价格，再选择调用 ID</a>。
        </p>
      </div>
      <p className="mt-4 text-xs leading-6 text-slate-500">
        参考汇率：{usdCnyReference.asOf}，1 美元约合人民币 {usdCnyReference.rate.toFixed(2)} 元。折扣是「美元额度面值按参考汇率折人民币」与「人民币购买价」之间的比较，
        不代表各模型调用费用比官方 API 便宜相同比例。套餐标价核对日期：{priceCheckedOn}；实时售价、库存、可用模型及实际扣费规则以商城和 API Key 权限为准。
      </p>
    </section>
  );
}
