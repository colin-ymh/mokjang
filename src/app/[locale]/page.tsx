import { redirect } from 'next/navigation';

export default function LocaleRootPage({
  params,
}: {
  params: { locale: string };
}) {
  // /ko  → /ko/admin/main
  // /en  → /en/admin/main
  redirect(`/${params.locale}/admin/main`);
}
