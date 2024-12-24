"use client";

import styled from "styled-components";
import { MainText } from "@/components/atoms/common/text/main-text";
import { GRAY, MAIN } from "@/constants/styles/color";
import { SIZE } from "@/constants/styles/style";

export type RadioButtonItemProps = {
  title: string;
  isSelected: boolean;
  onClick: (event: any) => void;
  isCheck?: boolean;
};

const LabelButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button<{ $isSelected: boolean }>`
  width: 28px;
  height: 28px;
  margin-right: 5px;
  aspect-ratio: 1;
  border-radius: 50px;
  border: 2px solid ${GRAY.DEFAULT};
  background-color: ${({ $isSelected }) =>
    $isSelected ? MAIN.DEFAULT : "transparent"};
  cursor: pointer;
`;

const DefaultRadioButton = ({
  title,
  isSelected,
  onClick,
}: RadioButtonItemProps) => {
  return (
    <LabelButtonContainer>
      <Button $isSelected={isSelected} type="button" onClick={onClick} />
      <MainText size={SIZE.SMALL}>{title}</MainText>
    </LabelButtonContainer>
  );
};

export default DefaultRadioButton;
