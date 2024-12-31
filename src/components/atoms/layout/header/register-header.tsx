import { usePathname, useRouter } from "next/navigation";

import RegisterHeaderView from "@/components/atoms/layout/header/register-header.view";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState } from "react";
import ConfirmPopup from "@/components/atoms/common/popup/confirm-popup";
import { useI18n, useScopedI18n } from "../../../../../locales/client";

const RegisterHeader = () => {
  const t_popup = useScopedI18n("popup");
  const t_button = useScopedI18n("button");
  const member = useSelector((state: RootState) => state.memberRegister.member);
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 가져오기

  const [isConfirmShow, setIsConfirmShow] = useState<boolean>(false);

  const onClickGoBack = () => {
    setIsConfirmShow(true);
  };

  const onClickDone = () => {
    console.log(member);
  };

  const onClickPopupCancel = () => {
    setIsConfirmShow(false);
  };

  const onClickPopupConfirm = () => {
    setIsConfirmShow(false);

    const basePath = pathname.split("/")[1]; // 언어 코드 추출 (ko 또는 en)
    router.push(`/${basePath}`);
  };

  const props = {
    onClickGoBack,
    onClickDone,
  };

  return (
    <>
      <RegisterHeaderView {...props} />
      <ConfirmPopup
        title={t_popup("cancelRegisterTitle")}
        body={t_popup("cancelRegisterContent")}
        isShow={isConfirmShow}
        buttonNum={2}
        leftButtonText={t_button("cancel")}
        rightButtonText={t_button("confirm")}
        onClickLeftButton={onClickPopupCancel}
        onClickRightButton={onClickPopupConfirm}
      />
    </>
  );
};
export default RegisterHeader;
