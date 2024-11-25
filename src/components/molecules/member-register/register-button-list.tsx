import Button from "@/components/atoms/common/button/button";
import React from "react";
import styled from "styled-components";
import { BLACK, GRAY, MAIN, WHITE } from "@/common/styles/color";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useScopedI18n } from "../../../../locales/client";

const ButtonListContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  gap: 10px;
  padding: 10px 0 20px 0;
  background-color: ${WHITE};
`;

const ButtonContainer = styled.div`
  display: flex;
  height: 50px;
  width: 40%;
`;

const RegisterButtonList = () => {
  const { isStageClear } = useSelector(
    (state: RootState) => state.memberRegister,
  );
  const t_button = useScopedI18n("button");

  return (
    <ButtonListContainer>
      <ButtonContainer>
        <Button
          text={t_button("register")}
          disabled={!isStageClear}
          backgroundColor={isStageClear ? MAIN.DEFAULT : GRAY.DARK}
        />
      </ButtonContainer>
      <ButtonContainer>
        <Button
          text={t_button("invite")}
          disabled={!isStageClear}
          backgroundColor={isStageClear ? MAIN.LIGHT : GRAY.DARK}
        />
      </ButtonContainer>
    </ButtonListContainer>
  );
};

export default RegisterButtonList;
