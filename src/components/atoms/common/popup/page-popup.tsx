import { Dispatch, ReactNode, SetStateAction } from "react";
import styled from "styled-components";

import { WHITE } from "@/common/styles/color";
import Hide from "@/components/atoms/common/etc/hide";
import PopupLayout from "@/components/organisms/layout/popup-layout";

interface PagePopupProps {
  isShow: boolean;
  setIsShow: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

const PagePopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${WHITE};
  z-index: 1000;
  //overflow-y: auto; /* 내용이 길면 스크롤 가능하게 */
`;

// 특정 컴포넌트를 전체화면 페이지인 것처럼 보아게 해주는 모달
const PagePopup = ({ isShow, setIsShow, children }: PagePopupProps) => {
  if (!isShow) {
    return <Hide />;
  }

  const onClickLeft = () => {
    setIsShow(false);
  };

  return (
    <PagePopupContainer>
      <PopupLayout onClickLeft={onClickLeft}>{children}</PopupLayout>
    </PagePopupContainer>
  );
};

export default PagePopup;
