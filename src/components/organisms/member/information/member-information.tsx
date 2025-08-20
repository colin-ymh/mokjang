import { useState } from 'react';
import styled from 'styled-components';

import { MEMBER_INFORMATION_HEADER_ID } from '@/constants/layout/header';
import MemberInformationHeader from '@/components/molecules/member/information/header/member-information-header';
import { getMemberInformationContent } from '@/hooks/layout/render-layout';
import PopupHeaderBar from '@/components/atoms/layout/header/popup-header-bar';
import { useMemberInformationHeaderBarItems } from '@/hooks/layout/header-bar-items';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

type MemberInformationProps = {
  isPopup?: boolean;
};

const MemberInformation = ({ isPopup }: MemberInformationProps) => {
  const headerBarItems = useMemberInformationHeaderBarItems();

  const [memberContentId, setMemberContentId] = useState<string>(
    MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION
  );

  const onClickHeaderBarItem = (id: string) => {
    setMemberContentId(id);
  };

  return (
    <InformationContainer>
      {/* 기본 정보 */}
      <MemberInformationHeader />

      {/* 개인정보, 가족 등의 탭 바*/}
      <PopupHeaderBar
        value={memberContentId}
        items={headerBarItems}
        onClick={onClickHeaderBarItem}
      />

      {/* 콘텐츠 */}
      <ContentContainer>
        {getMemberInformationContent(
          memberContentId,
          setMemberContentId,
          isPopup
        )}
      </ContentContainer>
    </InformationContainer>
  );
};

export default MemberInformation;
