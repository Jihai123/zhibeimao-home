import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 与数据决策平台',
  description: '发现与连接全球前沿 AI 工具'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
