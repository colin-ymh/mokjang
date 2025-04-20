import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import { BLACK, MAIN } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { MEMBER } from '@/constants/member/member-column';
import { getRandomImage } from '@/utils/image';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ItemContainer = styled.div<{ $isFocused: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
  transition: background-color 0.3s ease;
  cursor: pointer;
  background-color: ${({ $isFocused }) => $isFocused && MAIN.EXTRA_LIGHT};

  &:hover {
    background-color: ${MAIN.EXTRA_LIGHT};
  }
`;

const ProfileImage = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 20%;
`;

type MultiMemberDropdownItemProps = {
  isSelected: boolean;
  item: MemberDropdownType;
  onClick: (item: MemberDropdownType) => void;
  isFocused: boolean;
};

const MultiMemberDropdownItem = ({
  item,
  onClick,
  isSelected,
  isFocused,
}: MultiMemberDropdownItemProps) => {
  return (
    <DropdownContainer>
      <ItemContainer onClick={() => onClick(item)} $isFocused={isFocused}>
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

export default MultiMemberDropdownItem;
