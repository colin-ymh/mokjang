import React from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { MEMBER_REGISTER_STAGE } from "@/constant/constant";
import { MainText } from "@/components/atoms/common/text/main-text";
import RegisterButtonList from "@/components/molecules/register/register-button-list";
import PersonalRegister from "@/components/molecules/register/personal-register";
import ReligiousRegister from "@/components/molecules/register/religious-register";
import RequiredRegister from "@/components/molecules/register/required-register";

import { useScopedI18n } from "../../../../locales/client";

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 30px;
  align-items: center;
  overflow: scroll;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 20px 0;
  width: 100%;
`;

const MemberRegisterView = () => {
  const { stage } = useSelector((state: RootState) => state.memberRegister);

  const t_register = useScopedI18n("register");

  return (
    <RegisterContainer>
      <TextContainer>
        <MainText fontSize={23} fontWeight={600}>
          {stage === MEMBER_REGISTER_STAGE.REQUIRED
            ? t_register("defaultHeaderPhrase")
            : t_register("extraHeaderPhrase")}
        </MainText>
      </TextContainer>
      {stage === MEMBER_REGISTER_STAGE.REQUIRED && <RequiredRegister />}
      {stage === MEMBER_REGISTER_STAGE.PERSONAL && <PersonalRegister />}
      {stage === MEMBER_REGISTER_STAGE.RELIGIOUS && <ReligiousRegister />}
      <RegisterButtonList />
    </RegisterContainer>
  );
};

export default MemberRegisterView;
