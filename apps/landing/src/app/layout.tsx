import type { Metadata } from 'next';
import Providers from './providers';

// import {favicon} from '../../public/favicon.jpg'

type RootLayoutProps = {
  children?: React.ReactNode;
};

export const metadata: Metadata = {
  title: 'ekkly',
  icons: {
    icon: '/favicon.jpg',
  },
  alternates: {
    canonical: '/ko', // 기본 언어가 /ko 라면
    languages: { ko: '/ko', en: '/en' },
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <head>
        {/* Google Fonts 등 외부 링크는 그대로 유지 가능 */}
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
        <meta
          name="naver-site-verification"
          content="48f54e2572745cabd8eb76d6699ed92b"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
