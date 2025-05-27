import { redirect } from 'next/navigation';

export default function LocaleRootPage({
  params,
}: {
  params: { locale: string };
}) {
  // /ko  → /ko/main
  // /en  → /en/main
  redirect(`/${params.locale}/main`);
}
