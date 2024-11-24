import Button from "@/components/atoms/common/button/button";
import React from "react";
import styled from "styled-components";
import { GRAY, MAIN, WHITE } from "@/common/styles/color";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  height: 50px;
  width: 90%;
  gap: 10px;
  padding: 10px 0 20px 0;
  background-color: ${WHITE};
`;

const RegisterButtonList = () => {
  const { isStageClear } = useSelector(
    (state: RootState) => state.memberRegister,
  );
  return (
    <ButtonContainer>
      <Button
        text={"등록하기"}
        disabled={!isStageClear}
        backgroundColor={isStageClear ? MAIN.DEFAULT : GRAY.DARK}
      />
      <Button
        text={"요청하기"}
        disabled={!isStageClear}
        backgroundColor={isStageClear ? MAIN.LIGHT : GRAY.DARK}
      />
    </ButtonContainer>
  );
};

export default RegisterButtonList;
