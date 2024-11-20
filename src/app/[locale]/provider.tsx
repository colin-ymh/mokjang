"use client";

import type { ReactNode } from "react";
import { I18nProviderClient, useCurrentLocale } from "../../../locales/client";

type ProviderProps = {
  children: ReactNode;
};

const TranslateProvider = ({ children }: ProviderProps) => {
  const locale = useCurrentLocale();

  return (
    <I18nProviderClient locale={locale} fallback={<p>Loading...</p>}>
      {children}
    </I18nProviderClient>
  );
};

export default TranslateProvider;
