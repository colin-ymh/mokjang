// /app/[locale]/provider.tsx
'use client';

import { ReactNode } from 'react';
import { I18nProviderClient, useCurrentLocale } from '../../../locales/client';

type Props = { children: ReactNode };

export default function TranslateProvider({ children }: Props) {
  const locale = useCurrentLocale(); // 이제 undefined가 절대 아님
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
}

// 'use client';
//
// import { ReactNode, useEffect, useState } from 'react';
// import { usePathname, useRouter } from 'next/navigation';
// import { I18nProviderClient, useCurrentLocale } from '../../../locales/client';
//
// type ProviderProps = {
//   children: ReactNode;
// };
//
// const TranslateProvider = ({ children }: ProviderProps) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [shouldRender, setShouldRender] = useState(false);
//
//   const localePrefix = getLocalePrefixFromPath(pathname);
//
//   useEffect(() => {
//     if (!localePrefix) {
//       const fallback = navigator.language.slice(0, 2);
//       router.replace(`/${fallback}${pathname}`);
//     } else {
//       setShouldRender(true); // 안전하게 렌더링 트리거
//     }
//   }, [localePrefix, pathname, router]);
//
//   const locale = useCurrentLocale();
//
//   if (!shouldRender) return null;
//
//   return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
// };
//
// export default TranslateProvider;
//
// function getLocalePrefixFromPath(pathname: string): string | undefined {
//   if (pathname.startsWith('/ko')) return 'ko';
//   if (pathname.startsWith('/en')) return 'en';
//   return undefined;
// }
