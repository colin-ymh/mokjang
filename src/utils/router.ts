import { usePathname, useRouter } from "next/navigation";

// locale 태그를 유지한 채로 페이지 이동하는 함수
export const usePageRouter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const push = (route: string) => {
    const basePath = pathname.split("/")[1]; // 언어 코드 추출
    router.push(`/${basePath}/${route}`);
  };

  return { push };
};
