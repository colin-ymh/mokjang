// locale 태그를 유지한 채로 페이지 이동하는 함수
import { usePathname, useRouter } from 'next/navigation';
import { LOCALE } from '@mokjang/app/src/constants/state/locale';

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
