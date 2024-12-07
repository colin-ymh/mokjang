import styled from "styled-components";

import HeaderBarView from "@/components/molecules/layout/header/header-bar.view";
import { useMemberInformationHeaderBarItems } from "@/hooks/layout/header-bar-items";
import MemberImageInput from "@/components/atoms/register/member-image-input";
import React from "react";
import { MainText } from "@/components/atoms/common/text/main-text";
import { Member } from "@/models/member/member";

const InformationHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 30px;
`;

const Information = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

type MemberInformationHeaderProps = {
  contentId: string;
  onClickItem: (id: string) => void;
  member: Member;
};

const MemberInformationHeader = ({
  contentId,
  onClickItem,
  member,
}: MemberInformationHeaderProps) => {
  return (
    <InformationHeader>
      <Information>
        <MemberImageInput value={""} onChange={() => {}} />
        <TextContainer>
          <MainText fontSize={20}>{member.name}</MainText>
          <MainText fontSize={18}>{member.mobilePhone}</MainText>
        </TextContainer>
      </Information>

      <HeaderBarView
        value={contentId}
        items={useMemberInformationHeaderBarItems()}
        onClick={onClickItem}
      />
    </InformationHeader>
  );
};

export default MemberInformationHeader;
