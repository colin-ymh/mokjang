import React from 'react';
import styled from 'styled-components';

import { MainText } from '../../common/text/main-text';
import { GRAY, MAIN, WHITE } from '../../../../constants/styles/color';

const HeaderBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow-x: auto;
`;

const BarItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  height: 30px;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  padding: 5px 15px;
  background-color: ${WHITE};
  border-bottom: ${({ $isSelected }) =>
    `2px solid ${$isSelected ? MAIN.DEFAULT : 'transparent'}`};
  transition: all 0.3s ease;
`;

export type HeaderBarItem = {
  id: string;
  title: string;
  icon?: any;
};

type HeaderBarViewProps = {
  value: string;
  items: HeaderBarItem[];
  onClick: (id: string) => void;
};

const HeaderBarView = ({ value, items, onClick }: HeaderBarViewProps) => {
  return (
    <HeaderBarContainer>
      {items.map(({ id, title }) => {
        return (
          <BarItem
            key={id}
            onClick={() => onClick(id)}
            $isSelected={id === value}
          >
            <MainText
              color={id === value ? MAIN.DEFAULT : GRAY.DARK}
              fontWeight={600}
            >
              {title}
            </MainText>
          </BarItem>
        );
      })}
    </HeaderBarContainer>
  );
};

export default HeaderBarView;
