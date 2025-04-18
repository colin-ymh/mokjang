import { ReactNode } from 'react';
import styled from 'styled-components';

import { WHITE } from '@/constants/styles/color';
import Hide from '@/components/atoms/common/etc/hide';
import PopupLayout from '@/components/organisms/layout/popup-layout';

const PagePopupContainer = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${WHITE};
  z-index: 1000;
  //overflow-y: auto; /* 내용이 길면 스크롤 가능하게 */
`;

interface PagePopupProps {
  isShow: boolean;
  onClickClose: () => void;
  children: ReactNode;
}

// 특정 컴포넌트를 전체화면 페이지인 것처럼 보아게 해주는 모달
const PagePopup = ({ isShow, onClickClose, children }: PagePopupProps) => {
  if (!isShow) {
    return <Hide />;
  }

  return (
    <PagePopupContainer>
      <PopupLayout onClickClose={onClickClose}>{children}</PopupLayout>
    </PagePopupContainer>
  );
};

export default PagePopup;
