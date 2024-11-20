import Button from "@/components/atoms/common/button/button";
import React from "react";
import styled from "styled-components";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  height: 100px;
  width: 90%;
`;

const RegisterButtonList = () => {
  return (
    <ButtonContainer>
      <Button text={"등록하기"} type={"submit"} />
      <Button text={"이어서 입력하기"} type={"ghost"} />
    </ButtonContainer>
  );
};

export default RegisterButtonList;
