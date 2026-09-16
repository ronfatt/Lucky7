import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/navigation/AppShell';

export const metadata: Metadata = {
  title: '紫微时空数字预测系统 (ZWTSP)',
  description: '个人传统术数与历史统计回测决策辅助系统 · 时位象数行验',
  manifest: '/manifest.json',
  themeColor: '#070A12',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ZWTSP',
  },
  icons: {
    icon: '/icons/icon-192.svg',
    apple: '/icons/icon-192.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-background text-foreground selection:bg-gold-500/30 selection:text-gold-200">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
