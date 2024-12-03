import React from "react";
import styled from "styled-components";

import { GRAY, MAIN, WHITE } from "@/common/styles/color";

import ExitButton from "../../../../../public/svg/cancel.svg";

const HeaderContainer = styled.header`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
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

type PopupHeaderViewProps = {
  onClickLeft: () => void;
};

const PopupHeaderView = ({ onClickLeft }: PopupHeaderViewProps) => {
  return (
    <HeaderContainer>
      <HeaderLeft>
        <ExitButton onClick={onClickLeft} />
      </HeaderLeft>
    </HeaderContainer>
  );
};

export default PopupHeaderView;
