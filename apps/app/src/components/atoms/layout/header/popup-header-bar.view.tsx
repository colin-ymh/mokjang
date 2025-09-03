import React from 'react';
import styled from 'styled-components';

import { MainText } from '../../common/text/main-text';
import { GRAY, MAIN, WHITE } from '../../../../constants/styles/color';
import { HeaderBarItem } from './header-bar.view';
import SvgIcon from '../../common/icon/svg-icon';

const PopupHeaderBarContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  background-color: ${WHITE};
  width: 100%;
`;

const BarItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  border-bottom: ${({ $isSelected }) =>
    `2px solid ${$isSelected ? MAIN.DEFAULT : 'transparent'}`};
  &:hover {
    border-bottom: ${({ $isSelected }) =>
      `2px solid ${$isSelected ? MAIN.DEFAULT : GRAY.LIGHT}`};
  }
`;

type PopupHeaderBarViewProps = {
  value: string;
  items: HeaderBarItem[];
  onClick: (id: string) => void;
};

const PopupHeaderBarView = ({
  value,
  items,
  onClick,
}: PopupHeaderBarViewProps) => {
  return (
    <PopupHeaderBarContainer>
      {items.map(({ id, title, icon }) => {
        return (
          <BarItem
            key={id}
            onClick={() => onClick(id)}
            $isSelected={id === value}
          >
            <SvgIcon
              svg={icon}
              color={id === value ? MAIN.DEFAULT : GRAY.DARK}
              width={2}
            />
            <MainText color={id === value ? MAIN.DEFAULT : GRAY.DARK}>
              {title}
            </MainText>
          </BarItem>
        );
      })}
    </PopupHeaderBarContainer>
  );
};

export default PopupHeaderBarView;
