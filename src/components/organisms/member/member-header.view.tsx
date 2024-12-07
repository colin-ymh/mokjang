import React from "react";
import styled from "styled-components";

import { GRAY } from "@/constants/styles/color";
import { MainText } from "@/components/atoms/common/text/main-text";
import { useScopedI18n } from "../../../../locales/client";
import HeaderBar from "@/components/molecules/layout/header/header-bar";
import { useMemberHeaderBarItems } from "@/hooks/layout/header-bar-items";
import Button from "@/components/atoms/common/button/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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

type MemberHeadBarViewProps = {
  onClickRegisterMemberButton: () => void;
};

const MemberHeaderView = ({
  onClickRegisterMemberButton,
}: MemberHeadBarViewProps) => {
  const t_header = useScopedI18n("header");
  const contentId = useSelector((state: RootState) => state.layout.contentId);

  return (
    <HeaderContainer>
      <MainText fontSize={25} fontWeight={500}>
        {t_header("member")}
      </MainText>
      <HeaderBar value={contentId} items={useMemberHeaderBarItems()} />
      <RegisterButtonContainer>
        <Button
          text={"교인 등록하기"}
          width={100}
          height={40}
          onClick={onClickRegisterMemberButton}
        />
      </RegisterButtonContainer>
    </HeaderContainer>
  );
};

export default MemberHeaderView;
