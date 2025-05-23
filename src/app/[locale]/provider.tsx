'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { I18nProviderClient, useCurrentLocale } from '../../../locales/client';

type ProviderProps = {
  children: ReactNode;
};

const TranslateProvider = ({ children }: ProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useCurrentLocale(); // ✅ 훅은 항상 최상단에 위치

  useEffect(() => {
    const localePrefix = getLocalePrefixFromPath(pathname);

    if (!localePrefix && typeof window !== 'undefined') {
      const browserLang = navigator.language.slice(0, 2);
      router.replace(`/${browserLang}${pathname}`);
    }
  }, [pathname, router]);

  const localePrefix = getLocalePrefixFromPath(pathname);
  if (!localePrefix) return null; // ✅ 조건부 렌더링은 useEffect 뒤에서만

  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
};

export default TranslateProvider;

/** "/ko/..." → "ko", "/en/..." → "en", 그 외는 undefined */
function getLocalePrefixFromPath(pathname: string): string | undefined {
  if (pathname.startsWith('/ko')) return 'ko';
  if (pathname.startsWith('/en')) return 'en';
  return undefined;
}
