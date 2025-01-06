'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
// ↑ next/navigation (Next.js 13 이상)
//   구버전은 useRouter().pathname 등을 사용
import { I18nProviderClient, useCurrentLocale } from '../../../locales/client';
import { LOCALE } from '@/constants/state/locale';

type ProviderProps = {
  children: ReactNode;
};

const TranslateProvider = ({ children }: ProviderProps) => {
  const pathname = usePathname();
  // 예: "/ko/auth/login" → localePrefix = "ko"
  //    "/en/..." → localePrefix = "en"
  //    "/auth/login" → localePrefix = undefined
  const localePrefix = getLocalePrefixFromPath(pathname);

  // (1) prefix가 있다면 useCurrentLocale() 결과를,
  // (2) prefix가 없다면 기본 로캘(LOCALE.KO)을 사용
  const locale = localePrefix ? useCurrentLocale() : LOCALE.KO;

  return (
    <I18nProviderClient locale={locale} fallback={<p>Loading...</p>}>
      {children}
    </I18nProviderClient>
  );
};

export default TranslateProvider;

/**
 * "/ko/..."면 "ko",
 * "/en/..."이면 "en",
 * 그 외는 undefined를 반환하는 헬퍼 함수
 */
function getLocalePrefixFromPath(pathname: string): string | undefined {
  // 로케일 목록이 많아질 경우 이 로직을 확장할 수 있음
  if (pathname.startsWith('/ko/')) return 'ko';
  if (pathname.startsWith('/en/')) return 'en';
  return undefined;
}
