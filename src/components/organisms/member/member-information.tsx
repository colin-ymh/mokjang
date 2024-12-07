import { useState } from "react";
import styled from "styled-components";

import { Member } from "@/models/member/member";
import MemberInformationHeader from "@/components/molecules/member/member-information-header";
import { getMemberInformationContent } from "@/hooks/layout/render-layout";
import { MEMBER_INFORMATION_HEADER_ID } from "@/constants/layout/header";

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 1000px;
  width: 1000px;
`;

type MemberInformationProps = {
  member: Member;
};

const MemberInformation = ({ member }: MemberInformationProps) => {
  const [contentId, setContentId] = useState<string>(
    MEMBER_INFORMATION_HEADER_ID.MEMBER_INFORMATION,
  );

  const onClickHeaderBarItem = (id: string) => {
    setContentId(id);
  };

  return (
    <InformationContainer>
      <MemberInformationHeader
        contentId={contentId}
        onClickItem={onClickHeaderBarItem}
        member={member}
      />
      {getMemberInformationContent(contentId, member)}
    </InformationContainer>
  );
};

export default MemberInformation;
