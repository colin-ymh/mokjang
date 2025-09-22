// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { LOCALE } from '../../../packages/constants/src';

const DEFAULT_LOCALE = LOCALE.KO;
const LOCALES = Object.values(LOCALE);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) 정적/특수 파일들은 미들웨어 우회 (public/ 아래 정적 서빙)
  if (
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/sitemap') || // e.g. /sitemap-0.xml
    pathname === '/favicon.ico' ||
    pathname.startsWith('/apple-touch-icon') ||
    pathname === '/site.webmanifest' ||
    pathname.startsWith('/manifest') ||
    pathname.startsWith('/naver') || // naver-site-verification.html 같은 파일
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(png|jpe?g|gif|svg|webp|avif|css|js|txt|xml)$/)
  ) {
    return NextResponse.next();
  }

  // 2) 이미 /ko, /en 같은 언어 프리픽스면 통과
  if (LOCALES.some((l) => pathname.startsWith(`/${l}`))) {
    return NextResponse.next();
  }

  // 3) 브라우저 언어로 locale 결정 (없으면 기본값)
  const accept = req.headers.get('accept-language') ?? '';
  const browserLocale = accept.split(',')[0].split('-')[0] as LOCALE;
  const locale = LOCALES.includes(browserLocale)
    ? browserLocale
    : DEFAULT_LOCALE;

  // 4) 나머지는 /{locale}로 리다이렉트
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
}

// 루트 포함 전체 경로에 적용하되, 위에서 예외 처리함
export const config = {
  matcher: ['/', '/:path*'],
};
