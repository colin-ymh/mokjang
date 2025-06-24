import React from 'react';
import styled from 'styled-components';

import { Member } from '@/models/member/member';
import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getAge, getDateFromInput } from '@/utils/date';
import CheckButton from '@/components/atoms/common/button/check-button';
import ProfileImage from '@/components/atoms/common/image/profile-image';

const BackgroundContainer = styled.div`
  display: flex;
  position: relative;
  padding: 5px 0;
  border-bottom: 1px solid ${GRAY.SEMI_LIGHT};
`;

const ItemContainer = styled.div<{ $isEnable: boolean }>`
  display: flex;
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  cursor: ${({ $isEnable }) => ($isEnable ? 'pointer' : 'auto')};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${GRAY.SEMI_LIGHT};
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  right: 10px;
`;

type AddMemberItemProps = {
  member: Member;
  isEnable: boolean;
  isSelected: boolean;
  onClick: (member: Member) => void;
};

const AddMemberItem = ({
  member,
  isEnable,
  isSelected,
  onClick,
}: AddMemberItemProps) => {
  return (
    <BackgroundContainer>
      <ItemContainer
        $isEnable={isEnable}
        onClick={() => {
          isEnable && onClick(member);
        }}
      >
        <ProfileImage value={member.profileImageUrl} />
        <MainText>{member.name}</MainText>
        <MainText color={GRAY.DARK}>
          {member.birth && `(${getAge(getDateFromInput(member.birth))})`}
        </MainText>

        {isEnable && (
          <ButtonContainer>
            <CheckButton value={isSelected} isStopPropagation={false} />
          </ButtonContainer>
        )}
      </ItemContainer>
    </BackgroundContainer>
  );
};

export default AddMemberItem;
