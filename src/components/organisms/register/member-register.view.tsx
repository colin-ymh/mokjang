import React from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { MEMBER_REGISTER_STAGE } from "@/constants/constant";
import { MainText } from "@/components/atoms/common/text/main-text";
import RegisterButtonList from "@/components/molecules/register/register-button-list";
import PersonalRegister from "@/components/molecules/register/personal-register";
import ReligiousRegister from "@/components/molecules/register/religious-register";
import RequiredRegister from "@/components/molecules/register/required-register";
import { WHITE } from "@/constants/styles/color";

import { useScopedI18n } from "../../../../locales/client";
import { SIZE } from "@/constants/styles/style";

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${WHITE};
  width: 100%;
`;

const TextContainer = styled.div`
  padding: 20px 30px;
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

const MemberRegisterView = () => {
  const { stage } = useSelector((state: RootState) => state.memberRegister);
  const t_register = useScopedI18n("register");

  return (
    <RegisterContainer>
      <ContentContainer>
        <TextContainer>
          <MainText size={SIZE.EXTRA_LARGE}>
            {stage === MEMBER_REGISTER_STAGE.REQUIRED
              ? t_register("defaultHeaderPhrase")
              : t_register("extraHeaderPhrase")}
          </MainText>
        </TextContainer>
        {stage === MEMBER_REGISTER_STAGE.REQUIRED && <RequiredRegister />}
        {stage === MEMBER_REGISTER_STAGE.PERSONAL && <PersonalRegister />}
        {stage === MEMBER_REGISTER_STAGE.RELIGIOUS && <ReligiousRegister />}
      </ContentContainer>
      <RegisterButtonList />
    </RegisterContainer>
  );
};

export default MemberRegisterView;
