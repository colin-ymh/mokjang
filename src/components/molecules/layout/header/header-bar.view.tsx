import React from "react";
import styled from "styled-components";

import { MainText } from "@/components/atoms/common/text/main-text";
import { GRAY, MAIN, WHITE } from "@/constants/styles/color";

const HeaderBarContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const BarItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  height: 30px;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  padding: 5px 15px;
  border-bottom: ${({ $isSelected }) =>
    `2px solid ${$isSelected ? MAIN.DEFAULT : WHITE}`};
  transition: all 0.3s ease;
`;

export type HeaderBarViewItem = {
  id: string;
  title: string;
};

type HeaderBarViewProps = {
  value: string;
  items: HeaderBarViewItem[];
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
