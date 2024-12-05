import React, { ReactNode } from "react";
import styled from "styled-components";
import { MainText } from "@/components/atoms/common/text/main-text";
import { BLACK, DESTRUCTIVE, MAIN, WHITE } from "@/constants/styles/color";
import PopupHeader from "@/components/molecules/layout/header/popup-header";
import ExitButton from "../../../../../public/svg/cancel.svg";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const HeaderContainer = styled.header`
  display: flex;
  height: 40px;
  background-color: ${WHITE};
  justify-content: flex-start;
  align-items: flex-end;
  padding-bottom: 10px;
`;

const HeaderLeft = styled.div`
  display: flex;
  padding-left: 10px;
`;

type CustomPopupProps = {
  isShow: boolean;
  onClickClose: () => void;
  children: ReactNode;
};

const CustomPopup = ({ isShow, onClickClose, children }: CustomPopupProps) => {
  if (!isShow) return null;
  return (
    <ModalOverlay>
      <ModalContainer>
        <HeaderContainer>
          <HeaderLeft>
            <ExitButton onClick={onClickClose} />
          </HeaderLeft>
        </HeaderContainer>
        {children}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CustomPopup;
