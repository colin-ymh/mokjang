import styled from 'styled-components';
import { RadioButtonItemProps } from '@/components/atoms/common/input/radio-button/default-radio-button';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, WHITE } from '@/constants/styles/color';

const ButtonContainer = styled.div<{ $isSelected: boolean; color?: string }>`
  display: flex;
  flex: 1;
  height: 10px;
  border: ${({ $isSelected, color }) =>
    $isSelected
      ? `1px solid ${color || GRAY.DARK}`
      : `1px solid ${GRAY.DEFAULT}`};
  border-radius: 5px;
  padding: 10px;
  transition: all 0.5s ease;
  background-color: ${({ $isSelected, color }) =>
    $isSelected ? color || GRAY.DARK : WHITE};
  justify-content: center;
  align-items: center;
`;

type RegisterRadioButtonProps = RadioButtonItemProps & {
  color?: string;
};

const RegisterRadioButton = ({
  title,
  isSelected,
  onClick,
  color,
}: RegisterRadioButtonProps) => {
  return (
    <ButtonContainer onClick={onClick} $isSelected={isSelected} color={color}>
      <MainText color={isSelected ? WHITE : GRAY.DEFAULT}>{title}</MainText>
    </ButtonContainer>
  );
};

export default RegisterRadioButton;
