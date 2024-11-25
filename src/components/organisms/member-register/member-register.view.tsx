import React from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { MEMBER_REGISTER_STAGE } from "@/constant/constant";
import RegisterButtonList from "@/components/molecules/member-register/register-button-list";
import { MainText } from "@/components/atoms/common/text/main-text";

import RequiredRegisterView, {
  CommonRegisterProps,
  RequiredRegisterViewProps,
} from "@/components/molecules/member-register/required-register.view";
import ReligiousRegisterView, {
  ReligiousRegisterViewProps,
} from "@/components/molecules/member-register/religious-register.view";
import PersonalRegisterView, {
  PersonalRegisterViewProps,
} from "@/components/molecules/member-register/personal-register.view";
import { useScopedI18n } from "../../../../locales/client";

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 30px;
  align-items: center;
  overflow: auto;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 20px 0;
  width: 100%;
`;

type MemberRegisterViewProps = {
  common: CommonRegisterProps;
  required: RequiredRegisterViewProps;
  personal: PersonalRegisterViewProps;
  religious: ReligiousRegisterViewProps;
};

const MemberRegisterView = ({
  common,
  required,
  personal,
  religious,
}: MemberRegisterViewProps) => {
  const { member, stage } = useSelector(
    (state: RootState) => state.memberRegister,
  );

  const t_register = useScopedI18n("register");

  return (
    <RegisterContainer>
      <TextContainer>
        <MainText fontSize={23} fontWeight={600}>
          {t_register("defaultHeaderPhrase")}
        </MainText>
      </TextContainer>
      {stage === MEMBER_REGISTER_STAGE.REQUIRED && (
        <RequiredRegisterView {...common} {...required} />
      )}
      {stage === MEMBER_REGISTER_STAGE.PERSONAL && (
        <PersonalRegisterView {...common} {...personal} />
      )}
      {stage === MEMBER_REGISTER_STAGE.RELIGIOUS && (
        <ReligiousRegisterView {...common} {...religious} />
      )}
      <RegisterButtonList />
    </RegisterContainer>
  );
};

export default MemberRegisterView;
