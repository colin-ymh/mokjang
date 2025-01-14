import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import { Member } from '@/models/member/member';
import { MEMBER } from '@/constants/member/member-column';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getAge, getDateFromString } from '@/utils/date';

import DefaultImage from '../../../../../public/png/default-member-image.png';

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
  border-radius: 5px;
`;

const SelectButton = styled.div<{ $isEnable: boolean; $isSelected: boolean }>`
  display: flex;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  position: absolute;
  right: 10px;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid ${GRAY.LIGHT};
  background-color: ${({ $isEnable, $isSelected }) =>
    $isEnable ? ($isSelected ? MAIN.LIGHT : WHITE) : GRAY.LIGHT};
  transition: background-color 0.2s;
`;

type AddMemberItemProps = {
  member: Member;
  isEnable: boolean;
  selectedMembers: Member[];
  onClick: (member: Member) => void;
};

const AddMemberItem = ({
  selectedMembers,
  isEnable,
  onClick,
  member,
}: AddMemberItemProps) => {
  const isSelected = selectedMembers.some((m) => m.id === member.id);
  return (
    <BackgroundContainer>
      <ItemContainer $isEnable={isEnable}>
        <ProfileImage
          src={member.profileImage || DefaultImage}
          alt={MEMBER.PROFILE_IMAGE}
        />
        <MainText>{member.name}</MainText>
        <MainText color={GRAY.DARK}>
          {member.birth && `(${getAge(getDateFromString(member.birth))})`}
        </MainText>
        <SelectButton
          $isEnable={isEnable}
          $isSelected={isSelected}
          onClick={() => isEnable && onClick(member)}
        />
      </ItemContainer>
    </BackgroundContainer>
  );
};

export default AddMemberItem;
