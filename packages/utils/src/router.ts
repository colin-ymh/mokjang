// locale 태그를 유지한 채로 페이지 이동하는 함수
import { usePathname, useRouter } from 'next/navigation';
import { LOCALE } from '@mokjang/constants';

export const usePageRouter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname.split('/')[1]; // 언어 코드 추출

  // basePath가 LOCALE에 포함되어 있는지 확인
  const getIsLocale = (path: string): boolean => {
    return Object.values(LOCALE).includes(path as LOCALE);
  };

  const push = (route: string) => {
    router.push(getIsLocale(basePath) ? `/${basePath}/${route}` : `/${route}`);
  };

  const replace = (route: string) => {
    router.replace(
      getIsLocale(basePath) ? `/${basePath}/${route}` : `/${route}`
    );
  };

  return { push, replace };
};

export const routeLandingPage = (page: string) => {
  window.location.href = `${process.env.NEXT_PUBLIC_LANDING_CLIENT_PROTOCOL}://${process.env.NEXT_PUBLIC_LANDING_CLIENT_HOST}:${process.env.NEXT_PUBLIC_LANDING_CLIENT_PORT}${page}`;
};

export const routeAppPage = (page: string) => {
  window.location.href = `${process.env.NEXT_PUBLIC_APP_CLIENT_PROTOCOL}://${process.env.NEXT_PUBLIC_APP_CLIENT_HOST}:${process.env.NEXT_PUBLIC_APP_CLIENT_PORT}${page}`;
};
