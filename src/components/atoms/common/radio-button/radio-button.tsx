import { ComponentType } from 'react';
import styled from 'styled-components';

import DefaultRadioButton, {
  RadioButtonItemProps,
} from '@/components/atoms/common/radio-button/default-radio-button';

export type RadioButtonValue = {
  value: any; // 실제 사용될 값
  title: string; // 라디오 버튼에서 표시될 title
};

export type RadioButtonProps = {
  items: RadioButtonValue[];
  selectedValue: any;
  onChange: (value: any) => void;
  customButton?: ComponentType<RadioButtonItemProps>;
};

const RadioButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
`;

/**
 * input 멤버 2개 이상인 객체 => 라디오버튼 상태 변경(체크, 해제) 중복 선택 불가
 * @param items // items 안의 value는 중복 허용 X
 * @param selectedValue // default값 입력 필수
 * @param onChange //
 * @param RadioButton
 * @returns
 */
const RadioButton = ({
  items,
  selectedValue,
  onChange,
  customButton,
}: RadioButtonProps) => {
  const onClick = (index: number) => {
    // items 중 해당 index에 해당하는 값의 전송
    onChange(items[index].value);
  };

  return (
    <RadioButtonContainer>
      {items.map((item, index) => {
        const RadioButtonItem = customButton || DefaultRadioButton;
        return (
          <RadioButtonItem
            key={item.value}
            title={item.title}
            isSelected={selectedValue === item.value}
            onClick={() => onClick(index)}
          />
        );
      })}
    </RadioButtonContainer>
  );
};

export default RadioButton;
