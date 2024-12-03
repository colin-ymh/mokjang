import React from "react";
import styled from "styled-components";

import { MainText } from "@/components/atoms/common/text/main-text";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BLACK, MAIN, WHITE } from "@/common/styles/color";

const HeaderBarContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const BarItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  height: 30px;
  justify-content: center;
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
  items: HeaderBarViewItem[];
  onClick: (id: string) => void;
};

const HeaderBarView = ({ items, onClick }: HeaderBarViewProps) => {
  const { contentId } = useSelector((state: RootState) => state.layout);
  return (
    <HeaderBarContainer>
      {items.map(({ id, title }) => {
        return (
          <BarItem onClick={() => onClick(id)} $isSelected={id === contentId}>
            <MainText
              fontSize={18}
              color={id === contentId ? MAIN.DEFAULT : BLACK}
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
