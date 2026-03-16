import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ActivePlay — Игровые подписки PS Plus, Xbox Game Pass | Купить в России',
  description:
    'Купить PS Plus Essential, Extra, Deluxe и Xbox Game Pass Core, Standard, Ultimate в России. Лучшие цены из турецкого PS Store, моментальное оформление, 3100+ довольных клиентов.',
  keywords: [
    'PS Plus купить',
    'Xbox Game Pass купить',
    'PlayStation подписка Россия',
    'ActivePlay',
    'игровые подписки',
    'PS Plus Турция',
    'Game Pass Россия',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${outfit.variable} antialiased`}>
        {/* Atmosphere blobs */}
        <div className="atmosphere-wrapper" aria-hidden="true">
          <div className="atmosphere-blob atmosphere-blob--blue" />
          <div className="atmosphere-blob atmosphere-blob--cyan" />
          <div className="atmosphere-blob atmosphere-blob--purple" />
        </div>
        {children}
      </body>
    </html>
  );
}
