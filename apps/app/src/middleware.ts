// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { LOCALE } from '@mokjang/constants';

const DEFAULT_LOCALE = LOCALE.KO;
const LOCALES = Object.values(LOCALE) as string[]; // ['ko','en',...]

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  // 이미 로케일 접두사면 통과
  if (
    LOCALES.some((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`)
  ) {
    return NextResponse.next();
  }

  // 정적/내부 경로는 통과
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.includes('.') // 확장자 가진 리소스 전부 패스 (png, jpg, css, js, woff2, map, json 등)
  ) {
    return NextResponse.next();
  }

  // 브라우저 언어 탐지 → 허용 로케일 매핑
  const accept = req.headers.get('accept-language') ?? '';
  const primary = accept.split(',')[0]?.trim().toLowerCase(); // e.g. 'en-US'
  const candidate = primary?.split('-')[0] as string; // 'en'
  const locale = LOCALES.includes(candidate) ? candidate : DEFAULT_LOCALE;

  // 쿼리/해시 보존하면서 경로만 갱신
  const url = nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

// 루트 포함 전역 매칭
export const config = {
  matcher: ['/', '/:path*'],
};
