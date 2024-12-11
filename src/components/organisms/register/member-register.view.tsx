import React from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { MEDIA_MIN_WIDTH, MEMBER_REGISTER_STAGE } from "@/constants/constant";
import { MainText } from "@/components/atoms/common/text/main-text";
import RegisterButtonList from "@/components/molecules/register/register-button-list";
import PersonalRegister from "@/components/molecules/register/personal-register";
import ReligiousRegister from "@/components/molecules/register/religious-register";
import RequiredRegister from "@/components/molecules/register/required-register";
import { GRAY } from "@/constants/styles/color";

import { useScopedI18n } from "../../../../locales/client";

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  justify-content: flex-start;
  align-items: center;
  background-color: ${GRAY.BACKGROUND};

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    width: 100%;
    height: 100%;
  }
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 20px 0;
  width: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: scroll;
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
      <ContentContainer>
        {stage === MEMBER_REGISTER_STAGE.REQUIRED && <RequiredRegister />}
        {stage === MEMBER_REGISTER_STAGE.PERSONAL && <PersonalRegister />}
        {stage === MEMBER_REGISTER_STAGE.RELIGIOUS && <ReligiousRegister />}
      </ContentContainer>
      <RegisterButtonList />
    </RegisterContainer>
  );
};

export default MemberRegisterView;
