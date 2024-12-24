import { useState } from "react";
import styled from "styled-components";

import MemberInformationHeader from "@/components/molecules/member/information/member-information-header";
import { getMemberInformationContent } from "@/hooks/layout/render-layout";
import { MEMBER_INFORMATION_HEADER_ID } from "@/constants/layout/header";
import { Member } from "@/models/member/member";

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  overflow-y: scroll;
  flex-grow: 1;
`;

type MemberInformationProps = {
  targetMember: Member;
};

const MemberInformation = ({ targetMember }: MemberInformationProps) => {
  const [contentId, setContentId] = useState<string>(
    MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION,
  );

  const onClickHeaderBarItem = (id: string) => {
    setContentId(id);
  };

  return (
    <InformationContainer>
      <MemberInformationHeader
        contentId={contentId}
        onClickItem={onClickHeaderBarItem}
      />
      <ContentContainer>
        {getMemberInformationContent(contentId, targetMember)}
      </ContentContainer>
    </InformationContainer>
  );
};

export default MemberInformation;
