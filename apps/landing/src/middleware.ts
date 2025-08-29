// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { LOCALE } from '@mokjang/constants';

const DEFAULT_LOCALE = LOCALE.KO;

// enum을 배열로 변환
const LOCALES = Object.values(LOCALE);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 이미 /ko or /en 접두사면 통과
  if (LOCALES.some((l) => pathname.startsWith(`/${l}`))) {
    return NextResponse.next();
  }

  // 정적·API·_next 경로는 패스
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(png|jpe?g|svg|css|js|webp)$/)
  ) {
    return NextResponse.next();
  }

  // 브라우저 언어
  const accept = req.headers.get('accept-language') ?? '';
  const browserLocale = accept.split(',')[0].split('-')[0] as LOCALE;

  const locale = LOCALES.includes(browserLocale)
    ? browserLocale
    : DEFAULT_LOCALE;

  return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
}

export const config = {
  matcher: ['/', '/:path*'], // 루트 포함 모든 경로
};
