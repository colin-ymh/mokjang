import React from "react";
import styled from "styled-components";

import { GRAY } from "@/constants/styles/color";
import { MainText } from "@/components/atoms/common/text/main-text";
import { useScopedI18n } from "../../../../locales/client";
import HeaderBar from "@/components/molecules/layout/header/header-bar";
import { useMemberHeaderBarItems } from "@/hooks/layout/header-bar-items";
import Button from "@/components/atoms/common/button/button";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 30px 20px 0 20px;
  gap: 20px;
  border-bottom: 1px solid ${GRAY.LIGHT};
`;

const RegisterButtonContainer = styled.div`
  display: flex;
  position: absolute;
  right: 40px;
  top: 60px;
`;

type MemberHeadBarViewProps = {};

const MemberHeaderView = ({}: MemberHeadBarViewProps) => {
  const t_header = useScopedI18n("header");
  return (
    <HeaderContainer>
      <MainText fontSize={25} fontWeight={500}>
        {t_header("member")}
      </MainText>
      <HeaderBar items={useMemberHeaderBarItems()} />
      <RegisterButtonContainer>
        <Button text={"교인 등록하기"} width={100} height={40} />
      </RegisterButtonContainer>
    </HeaderContainer>
  );
};

export default MemberHeaderView;
