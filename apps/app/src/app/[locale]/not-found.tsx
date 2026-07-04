import { redirect } from 'next/navigation';
import { LOCALE } from '@mokjang/constants';

// App Router의 not-found.tsx는 params를 props로 받지 않는다.
// 기존 `params.locale` 접근은 undefined 크래시(500)를 유발했다.
// 미매칭 경로는 기본 로케일 메인으로 안전하게 보낸다.
export default function NotFoundRedirect() {
  redirect(`/${LOCALE.KO}/main`);
}
