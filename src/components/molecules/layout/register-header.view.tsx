import React from "react";
import styled from "styled-components";

import { BLACK, GRAY, MAIN, WHITE } from "@/common/styles/color";
import { MainText } from "@/components/atoms/common/text/main-text";

import GoBackButton from "../../../../public/svg/chevron-left.svg";
import Button from "@/components/atoms/common/button/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MEMBER_REGISTER_STAGE } from "@/constant/constant";

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
  const { stage, isStageClear } = useSelector(
    (state: RootState) => state.memberRegister,
  );

  return (
    <HeaderContainer>
      <HeaderLeft>
        {stage !== MEMBER_REGISTER_STAGE.REQUIRED && (
          <Button
            text={"이전"}
            onClick={onClickGoBack}
            backgroundColor={WHITE}
            color={BLACK}
            fontSize={15}
            fontWeight={500}
          />
        )}
      </HeaderLeft>
      <HeaderRight>
        <Button
          text={"다음"}
          onClick={onClickGoNext}
          backgroundColor={WHITE}
          color={isStageClear ? MAIN.DEFAULT : GRAY.DARK}
          fontSize={15}
          fontWeight={500}
          disabled={!isStageClear}
        />
      </HeaderRight>
    </HeaderContainer>
  );
};

export default RegisterHeaderView;
