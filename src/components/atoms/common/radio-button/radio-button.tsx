'use client';

import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';

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
  padding: 10px;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
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
`;

const Fill = styled.div<{ $isSelected: boolean }>`
  display: flex;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background-color: ${({ $isSelected }) =>
    $isSelected ? MAIN.DEFAULT : 'transparent'};
`;

const RadioButton = ({ title, isSelected, onClick }: RadioButtonItemProps) => {
  return (
    <LabelButtonContainer onClick={onClick}>
      <Button $isSelected={isSelected} onClick={onClick}>
        <Fill $isSelected={isSelected} />
      </Button>
      {title && <MainText>{title}</MainText>}
    </LabelButtonContainer>
  );
};

export default RadioButton;
