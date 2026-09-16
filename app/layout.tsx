import type { Metadata } from 'next';
import { Krona_One } from 'next/font/google';
import './globals.css';

const kronaOne = Krona_One({
  variable: '--font-krona',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Puregan 甘普尔 — Card Portfolio Concept',
  description: '甘普尔的视觉与用户体验设计作品集，涵盖真实业务、产品体验、品牌与 IP 设计。',
  metadataBase: new URL('https://puregan-portfolio-cards.ganpuer1201.chatgpt.site'),
  openGraph: {
    title: 'Puregan 甘普尔 — Visual & User Experience Designer',
    description: '视觉体验、产品界面与品牌/IP设计作品集。',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Puregan 甘普尔 — Visual & User Experience Designer',
    description: '视觉体验、产品界面与品牌/IP设计作品集。',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${kronaOne.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
