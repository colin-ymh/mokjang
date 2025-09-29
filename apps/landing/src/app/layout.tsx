import type { Metadata } from 'next';
import Providers from './providers';

type RootLayoutProps = {
  children?: React.ReactNode;
};

export const metadata: Metadata = {
  title: 'ekkly - 교회 관리의 새로운 시작',
  description:
    '에클리는 교회 출석, 심방, 업무, 그룹, 사역 관리를 간편하게 돕는 교회 관리 플랫폼입니다.',
  icons: {
    icon: '/favicon.jpg',
  },
  alternates: {
    canonical: '/ko', // 기본 언어가 /ko 라면
    languages: { ko: '/ko', en: '/en' },
  },
  openGraph: {
    type: 'website',
    url: 'https://ekkly.life',
    siteName: 'ekkly',
    title: 'ekkly - 교회 관리의 새로운 시작',
    description:
      '에클리는 교회 출석, 심방, 업무, 그룹, 사역 관리를 간편하게 돕는 교회 관리 플랫폼입니다.',
    images: ['/favicon.jpg'],
    locale: 'ko_KR',
  },
  keywords: [
    '교회',
    '출석관리',
    '심방',
    '사역',
    'ekkly',
    '에클리',
    '예배',
    '교적',
    '교적부',
    '에클레시아',
    '교인',
    '교회 관리',
    'eccly',
  ],
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
