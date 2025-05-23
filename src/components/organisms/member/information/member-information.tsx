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
};

const MemberInformation = ({
  targetMember,
  setTargetMember,
}: MemberInformationProps) => {
  const [memberContentId, setMemberContentId] = useState<string>(
    MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION
  );

  const onClickHeaderBarItem = (id: string) => {
    setMemberContentId(id);
  };

  return (
    <InformationContainer>
      <MemberInformationHeader
        memberContentId={memberContentId}
        onClickItem={onClickHeaderBarItem}
        targetMember={targetMember}
      />
      <ContentContainer>
        {getMemberInformationContent(
          targetMember,
          setTargetMember,
          memberContentId,
          setMemberContentId
        )}
      </ContentContainer>
    </InformationContainer>
  );
};

export default MemberInformation;
