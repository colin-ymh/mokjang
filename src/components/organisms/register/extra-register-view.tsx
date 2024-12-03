import React from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { MEMBER_REGISTER_STAGE } from "@/constant/constant";
import { MainText } from "@/components/atoms/common/text/main-text";
import PersonalRegister from "@/components/molecules/register/personal-register";
import ReligiousRegister from "@/components/molecules/register/religious-register";
import ExtraButtonList from "@/components/molecules/register/extra-button-list";
import { GRAY } from "@/common/styles/color";

import { useScopedI18n } from "../../../../locales/client";

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  justify-content: center;
  align-items: center;
  overflow: scroll;
  background-color: ${GRAY.BACKGROUND};
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 20px 0;
  width: 100%;
`;

type ExtraMemberRegisterViewProps = {};

const ExtraMemberRegisterView = ({}: ExtraMemberRegisterViewProps) => {
  const { stage } = useSelector((state: RootState) => state.memberRegister);

  const t_register = useScopedI18n("register");

  return (
    <RegisterContainer>
      <TextContainer>
        <MainText fontSize={23} fontWeight={600}>
          {t_register("extraHeaderPhrase")}
        </MainText>
      </TextContainer>
      {stage === MEMBER_REGISTER_STAGE.PERSONAL && <PersonalRegister />}
      {stage === MEMBER_REGISTER_STAGE.RELIGIOUS && <ReligiousRegister />}
      <ExtraButtonList />
    </RegisterContainer>
  );
};

export default ExtraMemberRegisterView;
