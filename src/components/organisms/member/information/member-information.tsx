import { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';

import { MEMBER_INFORMATION_HEADER_ID } from '@/constants/layout/header';
import MemberInformationHeader from '@/components/molecules/member/information/member-information-header';
import { Member } from '@/models/member/member';
import { getMemberInformationContent } from '@/hooks/layout/render-layout';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  flex-grow: 1;
`;

type MemberInformationProps = {
  targetMember: Member;
  setTargetMember: Dispatch<SetStateAction<Member>>;
  onClickDelete?: () => void;
};

const MemberInformation = ({
  targetMember,
  setTargetMember,
  onClickDelete,
}: MemberInformationProps) => {
  const [contentId, setContentId] = useState<string>(
    MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION
  );

  const onClickHeaderBarItem = (id: string) => {
    setContentId(id);
  };

  return (
    <InformationContainer>
      <MemberInformationHeader
        contentId={contentId}
        onClickItem={onClickHeaderBarItem}
        targetMember={targetMember}
        onClickDelete={onClickDelete}
      />
      <ContentContainer>
        {getMemberInformationContent(
          targetMember,
          setTargetMember,
          contentId,
          setContentId
        )}
      </ContentContainer>
    </InformationContainer>
  );
};

export default MemberInformation;
