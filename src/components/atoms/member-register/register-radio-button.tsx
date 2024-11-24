import styled from "styled-components";
import { RadioButtonItemProps } from "@/components/atoms/common/input/radio-button/default-radio-button";
import { MainText } from "@/components/atoms/common/text/main-text";
import { GRAY, MAIN, WHITE } from "@/common/styles/color";

const ButtonContainer = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex: 1;
  border: ${({ $isSelected }) =>
    $isSelected ? `1px solid ${MAIN.DEFAULT}` : `1px solid ${GRAY.DEFAULT}`};
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
  background-color: ${({ $isSelected }) =>
    $isSelected ? MAIN.DEFAULT : WHITE};
`;

const RegisterRadioButton = ({
  title,
  isSelected,
  onClick,
}: RadioButtonItemProps) => {
  return (
    <ButtonContainer onClick={onClick} $isSelected={isSelected}>
      <MainText fontSize={16} color={isSelected ? WHITE : GRAY.DARK}>
        {title}
      </MainText>
    </ButtonContainer>
  );
};

export default RegisterRadioButton;
