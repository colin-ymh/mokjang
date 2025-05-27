import { redirect } from 'next/navigation';

export default function NotFoundRedirect({
  params,
}: {
  params: { locale: string };
}) {
  redirect(`/${params.locale}/admin/main`);
}
