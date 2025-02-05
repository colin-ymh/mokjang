import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import { BLACK, GRAY, MAIN } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { GENDER } from '@/constants/constant';
import { MEMBER } from '@/constants/member/member-column';
import { getRandomImage } from '@/utils/image';

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ItemContainer = styled.div<{ $isFocused: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  transition: background-color 0.3s ease;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ $isFocused }) => $isFocused && GRAY.LIGHT};

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

const ProfileImage = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 20%;
`;

export type MemberDropdownType = DropdownValueType & {
  profileImage?: string;
  age?: number;
  gender?: GENDER;
};

type MemberDropdownItemProps = {
  isSelected: boolean;
  item: MemberDropdownType;
  onClick: (index: number) => void;
  isFocused: boolean;
};

const MemberDropdownItem = ({
  item,
  onClick,
  isSelected,
  isFocused,
}: MemberDropdownItemProps) => {
  return (
    <DropdownContainer>
      <ItemContainer onClick={() => onClick(item.value)} $isFocused={isFocused}>
        <ProfileImage
          src={item.profileImage || getRandomImage(item.value)}
          alt={MEMBER.PROFILE_IMAGE}
        />
        <MainText color={isSelected ? MAIN.DEFAULT : BLACK}>
          {item.title}
        </MainText>
        <MainText color={isSelected ? MAIN.DEFAULT : BLACK}>
          {item.age !== undefined && `(${item.age})`}
        </MainText>
      </ItemContainer>
    </DropdownContainer>
  );
};

export default MemberDropdownItem;
