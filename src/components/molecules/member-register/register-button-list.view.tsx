import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import Button from "@/components/atoms/common/button/button";
import { BLACK, GRAY, MAIN, WHITE } from "@/common/styles/color";
import { BLANK } from "@/common/default/default-value";
import { MEMBER_REGISTER_STAGE } from "@/constant/constant";

import GoBackButton from "../../../../public/svg/chevron-left.svg";
import { useScopedI18n } from "../../../../locales/client";

const ButtonListContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 90%;
  gap: 10px;
  margin-bottom: 20px;
  z-index: 5;
`;

const LeftButtonContainer = styled.div`
  display: flex;
  height: 50px;
  flex: 1;
  transition: all 0.3s ease;
`;

const RightButtonContainer = styled.div<{ $flex: number }>`
  display: flex;
  height: 50px;
  flex: ${({ $flex }) => $flex};
  transition: all 0.3s ease;
`;

type RegisterButtonListViewProps = {
  onClickLeft: () => void;
  onClickRight: () => void;
  getRightButtonTitle: () => string;
};

const RegisterButtonListView = ({
  onClickLeft,
  onClickRight,
  getRightButtonTitle,
}: RegisterButtonListViewProps) => {
  const { stage, isStageClear } = useSelector(
    (state: RootState) => state.memberRegister,
  );
  const t_button = useScopedI18n("button");

  return (
    <ButtonListContainer>
      <LeftButtonContainer>
        <Button
          text={
            stage === MEMBER_REGISTER_STAGE.REQUIRED
              ? t_button("invite")
              : BLANK
          }
          disabled={!isStageClear}
          backgroundColor={isStageClear ? BLACK : GRAY.LIGHT}
          onClick={onClickLeft}
          isShadow={true}
        >
          {stage !== MEMBER_REGISTER_STAGE.REQUIRED && (
            <GoBackButton stroke={WHITE} />
          )}
        </Button>
      </LeftButtonContainer>
      <RightButtonContainer
        $flex={stage === MEMBER_REGISTER_STAGE.REQUIRED ? 1 : 6}
      >
        <Button
          text={getRightButtonTitle()}
          disabled={!isStageClear}
          backgroundColor={isStageClear ? MAIN.DEFAULT : GRAY.LIGHT}
          onClick={onClickRight}
          isShadow={true}
        />
      </RightButtonContainer>
    </ButtonListContainer>
  );
};

export default RegisterButtonListView;
