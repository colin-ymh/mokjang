import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { GRAY, MAIN, WHITE } from "@/common/styles/color";
import Button from "@/components/atoms/common/button/button";

import ExitButton from "../../../../public/svg/cancel.svg";
import { useScopedI18n } from "../../../../locales/client";
import { MEMBER_REGISTER_STAGE } from "@/constant/constant";

const HeaderContainer = styled.header`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background-color: ${WHITE};
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 10px;
`;

const HeaderLeft = styled.div`
  display: flex;
  padding-left: 10px;
`;

const HeaderRight = styled.div`
  display: flex;
  padding-right: 10px;
`;

type RegisterHeaderViewProps = {
  onClickGoBack: () => void;
  onClickDone: () => void;
};

const RegisterHeaderView = ({
  onClickGoBack,
  onClickDone,
}: RegisterHeaderViewProps) => {
  const t_button = useScopedI18n("button");
  const { stage, isStageClear } = useSelector(
    (state: RootState) => state.memberRegister,
  );

  return (
    <HeaderContainer>
      <HeaderLeft>
        <ExitButton onClick={onClickGoBack} />
      </HeaderLeft>
      <HeaderRight>
        {stage !== MEMBER_REGISTER_STAGE.REQUIRED && (
          <Button
            text={t_button("save")}
            onClick={onClickDone}
            backgroundColor={WHITE}
            color={isStageClear ? MAIN.DEFAULT : GRAY.DARK}
            fontSize={17}
            disabled={!isStageClear}
          />
        )}
      </HeaderRight>
    </HeaderContainer>
  );
};

export default RegisterHeaderView;
