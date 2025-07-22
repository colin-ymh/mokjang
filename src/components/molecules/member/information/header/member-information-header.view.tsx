import React from 'react';
import styled from 'styled-components';

import HeaderBarView from '@/components/atoms/layout/header/header-bar.view';
import { useMemberInformationHeaderBarItems } from '@/hooks/layout/header-bar-items';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { GRAY } from '@/constants/styles/color';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import ProfileImage from '@/components/atoms/common/image/profile-image';

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
  gap: 20px;
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

type MemberInformationHeaderViewProps = {
  memberContentId: string;
  onClickItem: (id: string) => void;
};

const MemberInformationHeaderView = ({
  memberContentId,
  onClickItem,
}: MemberInformationHeaderViewProps) => {
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );

  const headerBarItems = useMemberInformationHeaderBarItems();

  return (
    <>
      <InformationHeader>
        <Information>
          <ProfileImage
            value={targetMember?.profileImageUrl}
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
    </>
  );
};

export default MemberInformationHeaderView;
