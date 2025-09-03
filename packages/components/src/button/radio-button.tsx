'use client';

import styled from 'styled-components';
import { MainText } from '../text/main-text';
import { GRAY, MAIN, WHITE } from '@mokjang/constants';

export type RadioButtonItemProps = {
  title?: string;
  isSelected: boolean;
  onClick?: (event: any) => void;
  isBorder?: boolean;
};

const LabelButtonContainer = styled.div<{ $isBorder: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: ${({ $isBorder }) =>
    $isBorder ? `1px solid ${GRAY.LIGHT}` : 'none'};
  border-radius: 5px;
  gap: 10px;

  cursor: pointer;
`;

const Button = styled.div<{ $isSelected: boolean }>`
  display: flex;
  padding: 2px;
  border-radius: 100%;
  border: 1px solid
    ${({ $isSelected }) => ($isSelected ? MAIN.DEFAULT : GRAY.SEMI_LIGHT)};
  background-color: ${WHITE};
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s;
`;

const Fill = styled.div<{ $isSelected: boolean }>`
  display: flex;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background-color: ${({ $isSelected }) =>
    $isSelected ? MAIN.DEFAULT : 'transparent'};
  transition: background-color 0.2s;
`;

export const RadioButton = ({
  title,
  isSelected,
  onClick,
  isBorder = true,
}: RadioButtonItemProps) => {
  return (
    <LabelButtonContainer onClick={onClick} $isBorder={isBorder}>
      <Button $isSelected={isSelected} onClick={onClick}>
        <Fill $isSelected={isSelected} />
      </Button>
      {title && <MainText>{title}</MainText>}
    </LabelButtonContainer>
  );
};
