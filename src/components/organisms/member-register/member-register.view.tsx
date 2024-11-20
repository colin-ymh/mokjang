import React from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { MEMBER_REGISTER_STAGE } from "@/constant/constant";
import RegisterButtonList from "@/components/molecules/member-register/register-button-list";
import { MainText } from "@/components/atoms/common/text/main-text";

import RequiredRegisterView, {
  RequiredRegisterViewProps,
} from "@/components/molecules/member-register/required-register.view";
import ReligiousRegisterView, {
  ReligiousRegisterViewProps,
} from "@/components/molecules/member-register/religious-register.view";
import PersonalRegisterView, {
  PersonalRegisterViewProps,
} from "@/components/molecules/member-register/personal-register.view";

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 30px;
  align-items: center;
  overflow: hidden;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 20px 0;
  width: 100%;
`;

type MemberRegisterViewProps = {
  required: RequiredRegisterViewProps;
  personal: PersonalRegisterViewProps;
  religious: ReligiousRegisterViewProps;
};

const MemberRegisterView = ({ ...props }: MemberRegisterViewProps) => {
  const { member, stage } = useSelector(
    (state: RootState) => state.memberRegister,
  );
  return (
    <RegisterContainer>
      <TextContainer>
        <MainText fontSize={23} fontWeight={600}>
          새신자 정보를 입력해주세요
        </MainText>
      </TextContainer>
      {stage === MEMBER_REGISTER_STAGE.REQUIRED && (
        <RequiredRegisterView {...props.required} />
      )}
      {stage === MEMBER_REGISTER_STAGE.PERSONAL && (
        <PersonalRegisterView {...props.personal} />
      )}
      {stage === MEMBER_REGISTER_STAGE.RELIGIOUS && (
        <ReligiousRegisterView {...props.religious} />
      )}
      <RegisterButtonList />
    </RegisterContainer>
  );
};

export default MemberRegisterView;
