import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Mail, MessageSquareText } from 'lucide-react';

import { siteLinks } from '@/data/site-links';

export const metadata: Metadata = {
  title: '智享AI工具导航 介绍 | 指北猫',
  description: '了解智享AI工具导航的理念、承诺与联系方式。'
};

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
};

const qrResources = [
  {
    title: '',
    src: '/images/topics/forum/images.jpg'
  }
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
      <section className="surface-panel rounded-3xl p-6 md:p-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-cyan-300 transition-colors hover:text-cyan-200">
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>
        <h1 className="text-primary mt-4 text-3xl font-black tracking-tight md:text-4xl">智享AI工具导航 介绍</h1>
      </section>

      <section className="mt-6 space-y-4">
        <article className="surface-panel rounded-2xl p-5 md:p-6">
          <h2 className="text-xl font-bold text-primary">AI的力量</h2>
          <p className="mt-3 text-sm leading-relaxed text-secondary">
            我们相信 AI 不只是热点，而是每个人都能立即使用的生产力。指北猫坚持筛选真正有价值的工具与场景，让用户更快完成从发现、比较到上手的全过程。
          </p>
        </article>

        <article className="surface-panel rounded-2xl p-5 md:p-6">
          <h2 className="text-xl font-bold text-primary">我们的承诺</h2>
          <p className="mt-3 text-sm leading-relaxed text-secondary">
            保持信息真实、入口有效、体验稳定。我们会持续更新工具导航、排行榜和专题内容，帮助你在 AI 快速变化中持续做出更稳妥的选择。
          </p>
        </article>

        <article id="contact" className="surface-panel rounded-2xl p-5 md:p-6">
          <h2 className="text-xl font-bold text-primary">联系我们</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-primary">微信方式</p>
              <p className="mt-2 text-sm text-secondary">可通过页面二维码联系，添加时请备注“智享AI”。</p>
            </div>
            <a href={siteLinks.contactEmail} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-cyan-300/30">
              <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Mail className="h-4 w-4 text-cyan-300" />
                邮件方式
              </p>
              <p className="mt-2 text-sm text-secondary">zhixiangweilaiai@gmail.com</p>
            </a>
            <a
              href={siteLinks.forumGuide}
              {...externalLinkProps}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-cyan-300/30"
            >
              <p className="text-sm font-semibold text-primary">论坛留言</p>
              <p className="mt-2 text-sm text-secondary">前往 AI 论坛发布问题、交流使用体验。</p>
            </a>
            <a
              href={siteLinks.messageBoard}
              {...externalLinkProps}
              className="group rounded-xl border border-cyan-300/25 bg-cyan-400/[0.04] p-4 transition-all duration-300 hover:border-cyan-300/45 hover:bg-cyan-400/[0.08]"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                <MessageSquareText className="h-4 w-4 text-cyan-300" />
                页面下方直接留言反馈
              </p>
              <p className="mt-2 inline-flex items-center gap-1 text-sm text-cyan-200">
                前往留言板 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </p>
            </a>
          </div>
        </article>

        <article className="surface-panel rounded-2xl p-5 md:p-6">
          <h3 className="text-base font-semibold text-primary">微信我们</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {qrResources.map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <Image src={item.src} alt={item.title} width={280} height={280} className="h-auto w-full rounded-lg border border-white/10 object-cover" />
                <p className="mt-2 text-sm font-medium text-primary">{item.title}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
