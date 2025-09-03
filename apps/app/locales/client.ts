import { createI18nClient } from 'next-international/client';
import { LOCALE } from '../../../packages/constants/src';

export const {
  useI18n,
  useScopedI18n,
  I18nProviderClient,
  useChangeLocale,
  defineLocale,
  useCurrentLocale,
} = createI18nClient(
  {
    [LOCALE.KO]: () => import('./ko'),
    [LOCALE.EN]: () => import('./en'),
  },
  {}
);
