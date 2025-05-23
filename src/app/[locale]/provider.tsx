'use client';

import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { I18nProviderClient, useCurrentLocale } from '../../../locales/client';

type ProviderProps = {
  children: ReactNode;
};

const TranslateProvider = ({ children }: ProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const localePrefix = getLocalePrefixFromPath(pathname);

  console.log(pathname);

  if (!localePrefix) {
    router.push(`/${navigator.language.slice(0, 2)}${pathname}`);
    return;
  }

  const locale = useCurrentLocale();

  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
};

export default TranslateProvider;

/**
 * "/ko/..."면 "ko",
 * "/en/..."이면 "en",
 * 그 외는 undefined 를 반환하는 헬퍼 함수
 */
function getLocalePrefixFromPath(pathname: string): string | undefined {
  // 로케일 목록이 많아질 경우 이 로직을 확장할 수 있음
  if (pathname.startsWith('/ko')) return 'ko';
  if (pathname.startsWith('/en')) return 'en';
  return undefined;
}
