import type { Metadata } from 'next';
import Script from 'next/script';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import './globals.css';
import { AttributionCapture } from '@/components/StoreAttributionLink';
import { StructuredData } from '@/components/StructuredData';
import { siteGraphSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: '指北猫 - AI决策平台 | 新股分析 · 养老金测算 · AI工具推荐',
  description: '指北猫聚合 AI 工具、模型服务与实用决策产品，提供 AI API 统一接入、模型价格查询、养老金测算、宜居城市对比及新股研究入口，帮助你更快找到适合的工具。'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <AttributionCapture />
        <SiteHeader />
        {children}
        <SiteFooter />
        <StructuredData data={siteGraphSchema} />
        <Script id="baidu-tongji" strategy="afterInteractive">
          {`
            (function() {
              if (window.location.hostname !== "www.zhibeimao.com") return;

              window._hmt = window._hmt || [];
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?8dbf8b58ca53a47a0654705d5db34f60";
              var s = document.getElementsByTagName("script")[0];
              s.parentNode.insertBefore(hm, s);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
