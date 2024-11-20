import React from "react";
import styled from "styled-components";
import { WHITE } from "@/common/styles/color";
import { MainText } from "@/components/atoms/common/text/main-text";

const HeaderContainer = styled.header`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: ${WHITE};
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  padding-left: 20px;
`;

const HeaderRight = styled.div`
  display: flex;
  padding-right: 20px;
`;

type RegisterHeaderViewProps = {
  onClickGoBack: () => void;
  onClickGoNext: () => void;
};

const RegisterHeaderView = ({
  onClickGoBack,
  onClickGoNext,
}: RegisterHeaderViewProps) => {
  return (
    <HeaderContainer>
      <HeaderLeft>
        <MainText
          fontWeight={600}
          fontSize={17}
          onClick={onClickGoBack}
        >{`< 뒤로가기`}</MainText>
      </HeaderLeft>
      <HeaderRight>
        <MainText
          fontWeight={600}
          fontSize={17}
          onClick={onClickGoNext}
        >{`추가정보 >`}</MainText>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default RegisterHeaderView;
