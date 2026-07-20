import { NextRequest } from 'next/server';

// 주의: 서버 전용 모듈이므로 @mokjang/utils 배럴을 import하지 않는다.
// 배럴은 client 전용 훅(useRouter 등)을 재export하므로 서버 번들에 끌려오면
// next build가 깨진다. 대신 동일한 env 값을 process.env에서 직접 구성한다.
const IS_PRODUCTION = process.env.NEXT_PUBLIC_NODE_ENV === 'production';
const SERVER_URL = `${process.env.NEXT_PUBLIC_SERVER_PROTOCOL}://${process.env.NEXT_PUBLIC_SERVER_HOST}`;
const TEST_SERVER_URL = `${process.env.NEXT_PUBLIC_TEST_SERVER_PROTOCOL}://${process.env.NEXT_PUBLIC_TEST_SERVER_HOST}`;

const BACKEND_URL = IS_PRODUCTION ? SERVER_URL : TEST_SERVER_URL;

/**
 * Next.js API route용 인증 확인.
 *
 * 이 프로젝트는 인증을 외부 백엔드(쿠키 기반)에 위임한다. storage route 같은
 * 서버 라우트는 자체 세션이 없으므로, 들어온 요청의 쿠키를 백엔드 `/users`로
 * 그대로 전달해 200이면 로그인 상태로 간주한다.
 *
 * 주의: 앱과 백엔드가 **쿠키를 공유하는 도메인**(예: 동일 상위도메인 또는
 * 로컬호스트)일 때만 동작한다. 완전히 분리된 도메인이라 인증 쿠키가 Next 앱
 * 오리진으로 전송되지 않으면 항상 미인증으로 처리된다. 그 경우 인증은
 * 백엔드 쪽에서 처리되어야 한다.
 *
 * @returns 인증되면 true, 아니면 false
 */
export async function isAuthenticated(req: NextRequest): Promise<boolean> {
  // 긴급 완화용 킬스위치. 배포 후 인증 게이트가 정상 로그인 업로드를 막을 경우
  // (앱·백엔드 쿠키 미공유 등) 재배포 없이 STORAGE_AUTH_DISABLED=true로 즉시 우회.
  // 원인(쿠키 도메인) 해결 후 다시 제거할 것.
  if (process.env.STORAGE_AUTH_DISABLED === 'true') return true;

  const cookie = req.headers.get('cookie');
  if (!cookie) return false;

  try {
    const res = await fetch(`${BACKEND_URL}/users`, {
      method: 'GET',
      headers: { cookie },
      cache: 'no-store',
    });
    return res.ok;
  } catch {
    return false;
  }
}
