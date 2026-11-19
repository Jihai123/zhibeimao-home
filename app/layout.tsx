import type { Metadata } from 'next';
import Script from 'next/script';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import './globals.css';

export const metadata: Metadata = {
  title: '指北猫 - AI决策平台 | 新股分析 · 养老金测算 · AI工具推荐',
  description: '用AI帮你做决策：新股、养老金、AI工具选择等'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
        <Script id="baidu-tongji" strategy="afterInteractive">
          {`
            window._hmt = window._hmt || [];
            (function() {
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
