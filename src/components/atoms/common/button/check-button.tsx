import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';

const CheckButtonContainer = styled.div<{ $isChecked: boolean }>`
  display: flex;
  border: 1px solid ${GRAY.DEFAULT};
  border-radius: 5px;
  background-color: ${({ $isChecked }) => ($isChecked ? MAIN.DEFAULT : WHITE)};
  width: 20px;
  height: 20px;
  transition: background-color 0.2s;
`;

type CheckButtonProps = {
  value: boolean;
  onChange?: (value: boolean) => void;
};

const CheckButton = ({ value, onChange }: CheckButtonProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(value);

  useEffect(() => {
    setIsChecked(value);
  }, [value]);

  const onClick = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    if (onChange) {
      onChange(isChecked);
    }
  }, [isChecked]);

  return (
    <>
      <CheckButtonContainer $isChecked={isChecked} onClick={onClick} />
    </>
  );
};

export default CheckButton;
