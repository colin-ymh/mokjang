import { usePathname, useRouter } from "next/navigation";

import RegisterHeaderView from "@/components/molecules/layout/register-header.view";

const RegisterHeader = () => {
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 가져오기

  const onClickGoBack = () => {
    const basePath = pathname.split("/")[1]; // 언어 코드 추출 (ko 또는 en)
    router.push(`/${basePath}`);
    // if (stage === MEMBER_REGISTER_STAGE.REQUIRED) {
    //   const basePath = pathname.split("/")[1]; // 언어 코드 추출 (ko 또는 en)
    //   router.push(`/${basePath}`);
    // } else if (stage === MEMBER_REGISTER_STAGE.PERSONAL) {
    //   dispatch(setStage(MEMBER_REGISTER_STAGE.REQUIRED));
    // } else if (stage === MEMBER_REGISTER_STAGE.RELIGIOUS) {
    //   dispatch(setStage(MEMBER_REGISTER_STAGE.PERSONAL));
    // }
  };

  const onClickDone = () => {
    // const basePath = pathname.split("/")[1];
    // router.push(`/${basePath}`);
  };

  const props = {
    onClickGoBack,
    onClickDone,
  };

  return (
    <>
      <RegisterHeaderView {...props} />
    </>
  );
};
export default RegisterHeader;
