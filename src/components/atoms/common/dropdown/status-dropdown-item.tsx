import React from 'react';
import styled from 'styled-components';

import { BLACK, MAIN } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import SvgIcon from '@/components/atoms/common/icon/svg-icon';

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ItemContainer = styled.div<{ $isFocused: boolean }>`
  display: flex;
  padding: 10px;
  transition: background-color 0.3s ease;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  background-color: ${({ $isFocused }) => $isFocused && MAIN.EXTRA_LIGHT};

  &:hover {
    background-color: ${MAIN.EXTRA_LIGHT};
  }
`;

const ColoredDot = styled.div<{ color?: string }>`
  display: ${({ color }) => (color ? 'flex' : 'none')};
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: ${({ color }) => color};
`;

export type StatusDropdownValueType = {
  value: any;
  title: string;
  color?: string;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

type StatusDropdownItemProps = {
  item: StatusDropdownValueType;
  onClick: (index: number) => void;
  isSelected: boolean;
  isFocused: boolean;
};

const StatusDropdownItem = ({
  isSelected,
  onClick,
  item,
  isFocused,
}: StatusDropdownItemProps) => {
  return (
    <DropdownContainer>
      <ItemContainer onClick={() => onClick(item.value)} $isFocused={isFocused}>
        {item.icon && (
          <SvgIcon svg={item.icon} color={isSelected ? MAIN.DEFAULT : BLACK} />
        )}
        <MainText color={isSelected ? MAIN.DEFAULT : BLACK}>
          {item.title}
        </MainText>
      </ItemContainer>
    </DropdownContainer>
  );
};

export default StatusDropdownItem;
