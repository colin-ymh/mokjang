import React from 'react';
import styled from 'styled-components';

import { BLACK, MAIN } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { BLANK, GENDER } from '@/constants/constant';
import ProfileImage from '@/components/atoms/common/image/profile-image';

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
        <ProfileImage value={item.profileImage || BLANK} />
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
