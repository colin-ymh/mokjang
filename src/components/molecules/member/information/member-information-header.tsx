import React from 'react';
import styled from 'styled-components';

import HeaderBarView from '@/components/atoms/layout/header/header-bar.view';
import { useMemberInformationHeaderBarItems } from '@/hooks/layout/header-bar-items';
import ProfileImageInput from '@/components/atoms/common/image/profile-image-input';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { GRAY } from '@/constants/styles/color';
import { Member } from '@/models/member/member';

const InformationHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
  gap: 10px;
`;

const Information = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: relative;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
`;

const ChurchMemberInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

type MemberInformationHeaderProps = {
  targetMember: Member;
  memberContentId: string;
  onClickItem: (id: string) => void;
};

const MemberInformationHeader = ({
  targetMember,
  memberContentId,
  onClickItem,
}: MemberInformationHeaderProps) => {
  const headerBarItems = useMemberInformationHeaderBarItems();

  return (
    <InformationHeader>
      <Information>
        <ProfileImageInput
          memberId={targetMember.id}
          value={targetMember?.profileImage}
          onChange={() => {}}
          width={80}
          height={80}
        />
        <TextContainer>
          <MainText size={SIZE.LARGE}>{targetMember.name}</MainText>
          <ChurchMemberInfoContainer>
            <MainText size={SIZE.MEDIUM} color={GRAY.DARK}>
              {targetMember?.officer?.name}
            </MainText>
            <MainText size={SIZE.MEDIUM} color={GRAY.DARK}>
              {targetMember.group &&
                targetMember.group?.name &&
                targetMember?.officer?.name &&
                'ㆍ'}
            </MainText>
            <MainText size={SIZE.MEDIUM} color={GRAY.DARK}>
              {targetMember.group?.name}
            </MainText>
          </ChurchMemberInfoContainer>
        </TextContainer>
      </Information>

      {/* 개인정보, 가족 등의 탭 바*/}
      <HeaderBarView
        value={memberContentId}
        items={headerBarItems}
        onClick={onClickItem}
      />
    </InformationHeader>
  );
};

export default MemberInformationHeader;
