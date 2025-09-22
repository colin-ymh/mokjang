import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'ekkly 교회 관리',
  icons: {
    icon: '/favicon.jpg',
  },
};

type RootLayoutProps = {
  children?: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <head>
        {/* 폰트/메타 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/*<link*/}
        {/*  href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"*/}
        {/*  rel="stylesheet"*/}
        {/*/>*/}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
