import TranslateProvider from './provider';

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TranslateProvider>{children}</TranslateProvider>;
}
