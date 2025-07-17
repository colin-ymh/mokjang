import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { GRAY, MAIN } from '@/constants/styles/color';

import Check from '../../../../../public/svg/check.svg';

const CheckButtonContainer = styled.div<{
  width: number;
  height: number;
  $isChecked: boolean;
  $disabled: boolean;
}>`
  display: flex;
  border: ${({ $isChecked }) => `1px solid ${$isChecked ? MAIN.DEFAULT : GRAY.LIGHT};`}
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  border-radius: 2px;
`;

const CheckIcon = styled(Check)`
  width: 12px;
  height: 12px;
  stroke: ${MAIN.DEFAULT};
  stroke-width: 3px;
`;

type CheckButtonProps = {
  value: boolean; // 초기 값
  onChange?: (value: boolean) => void; // 변경 시 호출될 콜백
  disabled?: boolean;
  width?: number;
  height?: number;
  isStopPropagation?: boolean;
};

const CheckButton = ({
  value,
  onChange,
  disabled = false,
  width = 12,
  height = 12,
  isStopPropagation = true,
}: CheckButtonProps) => {
  // 로컬 상태 관리
  const [isChecked, setIsChecked] = useState<boolean>(value);

  // 부모로부터 받은 `value`가 변경되면 로컬 상태를 업데이트
  useEffect(() => {
    setIsChecked(value);
  }, [value]);

  // 버튼 클릭 핸들러
  const onClick = () => {
    if (!disabled) {
      const newValue = !isChecked;
      setIsChecked(newValue); // 로컬 상태 업데이트
      if (onChange) {
        onChange(newValue); // 변경 사항을 부모로 전달
      }
    }
  };

  return (
    <CheckButtonContainer
      onClick={(event) => {
        isStopPropagation && event.stopPropagation();
        onClick();
      }}
      width={width}
      height={height}
      $isChecked={isChecked}
      $disabled={disabled}
    >
      {isChecked && <CheckIcon />}
    </CheckButtonContainer>
  );
};

export default CheckButton;
