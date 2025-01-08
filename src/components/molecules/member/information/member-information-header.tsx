import React from 'react';
import styled from 'styled-components';

import HeaderBarView from '@/components/atoms/layout/header/header-bar.view';
import { useMemberInformationHeaderBarItems } from '@/hooks/layout/header-bar-items';
import MemberImageInput from '@/components/atoms/register/member-image-input';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getFormattedMobilePhone } from '@/utils/format';
import { SIZE } from '@/constants/styles/style';
import { Member } from '@/models/member/member';
import { GRAY } from '@/constants/styles/color';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const InformationHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
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
  gap: 5px;
`;

const ChurchMemberInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

type MemberInformationHeaderProps = {
  contentId: string;
  onClickItem: (id: string) => void;
};

const MemberInformationHeader = ({
  contentId,
  onClickItem,
}: MemberInformationHeaderProps) => {
  const headerBarItems = useMemberInformationHeaderBarItems();
  const targetMember = useSelector(
    (state: RootState) => state.targetMember.targetMember
  );
  return (
    <InformationHeader>
      <Information>
        <MemberImageInput
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
              {targetMember?.group?.name && targetMember?.officer?.name && 'ㆍ'}
            </MainText>
            <MainText size={SIZE.MEDIUM} color={GRAY.DARK}>
              {targetMember?.group?.name}
            </MainText>
          </ChurchMemberInfoContainer>
        </TextContainer>
      </Information>

      {/* 개인정보, 가족 등의 탭 바*/}
      <HeaderBarView
        value={contentId}
        items={headerBarItems}
        onClick={onClickItem}
      />
    </InformationHeader>
  );
};

export default MemberInformationHeader;
