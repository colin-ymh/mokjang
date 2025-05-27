import TranslateProvider from '@/app/[locale]/provider';

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TranslateProvider>{children}</TranslateProvider>;
}
