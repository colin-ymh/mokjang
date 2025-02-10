import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import { Member } from '@/models/member/member';
import { MEMBER } from '@/constants/member/member-column';
import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getAge, getDateFromString } from '@/utils/date';
import CheckButton from '@/components/atoms/common/button/check-button';
import { getRandomImage } from '@/utils/image';

const BackgroundContainer = styled.div`
  display: flex;
  position: relative;
  padding: 5px 0;
  border-bottom: 1px solid ${GRAY.LIGHT};
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
    background-color: ${GRAY.LIGHT};
  }
`;

const ProfileImage = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 20%;
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
        <ProfileImage
          src={member.profileImage || getRandomImage(member.id)}
          alt={MEMBER.PROFILE_IMAGE}
        />
        <MainText>{member.name}</MainText>
        <MainText color={GRAY.DARK}>
          {member.birth && `(${getAge(getDateFromString(member.birth))})`}
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
