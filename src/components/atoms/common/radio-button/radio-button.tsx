'use client';

import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';

export type RadioButtonItemProps = {
  title?: string;
  isSelected: boolean;
  onClick?: (event: any) => void;
  isCheck?: boolean;
};

const LabelButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const Button = styled.div<{ $isSelected: boolean }>`
  display: flex;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  border: 1px solid
    ${({ $isSelected }) => ($isSelected ? MAIN.DEFAULT : GRAY.LIGHT)};
  background-color: ${WHITE};
  cursor: pointer;
  justify-content: center;
  align-items: center;
`;

const Fill = styled.div`
  display: flex;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background-color: ${MAIN.DEFAULT};
`;

const RadioButton = ({ title, isSelected, onClick }: RadioButtonItemProps) => {
  return (
    <LabelButtonContainer>
      <Button $isSelected={isSelected} onClick={onClick}>
        {isSelected && <Fill />}
      </Button>
      {title && <MainText size={SIZE.SMALL}>{title}</MainText>}
    </LabelButtonContainer>
  );
};

export default RadioButton;
