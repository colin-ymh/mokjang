'use client';

import { ReactNode } from 'react';
import { I18nProviderClient, useCurrentLocale } from '../../../locales/client';

type Props = { children: ReactNode };

export default function TranslateProvider({ children }: Props) {
  const locale = useCurrentLocale();
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
}
