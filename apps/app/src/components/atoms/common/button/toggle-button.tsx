import styled from 'styled-components';
import { ButtonProps } from '@mokjang/components';
import { GRAY, MAIN, WHITE } from '@mokjang/constants';

const ToggleContainer = styled.div<{ $value: boolean }>`
  position: relative;
  width: 40px;
  height: 22px;
  background-color: ${({ $value }) =>
    $value ? MAIN.DEFAULT : GRAY.SEMI_LIGHT};
  border-radius: 11px;
  cursor: pointer;
  transition: background-color 0.5s ease;
`;

const Toggle = styled.div<{ $value: boolean }>`
  position: absolute;
  top: 1px;
  left: 1px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${WHITE};
  transition: transform 0.5s ease;
  transform: ${({ $value }) => ($value ? 'translateX(18px)' : 'translateX(0)')};
`;

type ToggleButtonProps = ButtonProps & {
  value: boolean;
  onClick: (value: any) => void;
};

const ToggleButton = ({ value, onClick }: ToggleButtonProps) => {
  return (
    <ToggleContainer $value={value} onClick={onClick}>
      <Toggle $value={value} />
    </ToggleContainer>
  );
};

export default ToggleButton;
