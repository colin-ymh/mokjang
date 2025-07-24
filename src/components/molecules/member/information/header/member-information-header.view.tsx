import React from 'react';
import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { GRAY } from '@/constants/styles/color';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import ProfileImage from '@/components/atoms/common/image/profile-image';
import { useI18n } from '../../../../../../locales/client';

const InformationHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  gap: 10px;
  background-color: ${GRAY.SUPER_LIGHT};
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
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

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

type MemberInformationHeaderViewProps = {};

const MemberInformationHeaderView = ({}: MemberInformationHeaderViewProps) => {
  const t = useI18n();

  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );

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
            <RowContainer>
              <MainText size={SIZE.EXTRA_LARGE}>{targetMember.name}</MainText>
              <MainText color={GRAY.DEFAULT}>
                {targetMember.officer?.name}
              </MainText>
            </RowContainer>
            <RowContainer>
              <MainText color={GRAY.DARK}>
                {targetMember.group?.name || t('noGroup')}
              </MainText>
            </RowContainer>
          </TextContainer>
        </Information>
      </InformationHeader>
    </>
  );
};

export default MemberInformationHeaderView;
