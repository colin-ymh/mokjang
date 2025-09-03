import React from 'react';
import styled from 'styled-components';

import { BLACK, MAIN } from '@mokjang/constants';
import { MainText } from '@mokjang/components';
import ProfileImage from '../image/profile-image';
import { BLANK, GENDER } from '@mokjang/constants';
import { DropdownValueType } from './dropdown-item';

export type MemberDropdownType = DropdownValueType & {
  profileImage?: string;
  age?: number;
  gender?: GENDER;
  officer?: string;
};

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;
`;

const ItemContainer = styled.div<{ $isFocused: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  transition: background-color 0.3s ease;

  background-color: ${({ $isFocused }) => $isFocused && MAIN.EXTRA_LIGHT};

  &:hover {
    background-color: ${MAIN.EXTRA_LIGHT};
  }
`;

type MultiMemberDropdownItemProps = {
  isSelected: boolean;
  item: MemberDropdownType;
  onClick: (item: MemberDropdownType) => void;
  isFocused: boolean;
};

const MemberDropdownItem = ({
  item,
  onClick,
  isSelected,
  isFocused,
}: MultiMemberDropdownItemProps) => {
  return (
    <DropdownContainer onClick={() => onClick(item)}>
      <ItemContainer $isFocused={isFocused}>
        <ProfileImage
          value={item.profileImage || BLANK}
          width={30}
          height={30}
        />
        <MainText color={isSelected ? MAIN.DEFAULT : BLACK}>
          {`${item.title} ${item.officer || BLANK}`}
        </MainText>
      </ItemContainer>
    </DropdownContainer>
  );
};

export default MemberDropdownItem;
