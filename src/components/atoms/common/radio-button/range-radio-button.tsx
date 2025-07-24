import styled from 'styled-components';
import { RadioButtonValue } from '@/components/atoms/common/radio-button/radio-button-list';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';

const RangeRadioButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: inherit;
  gap: 2px;
  background-color: ${GRAY.EXTRA_LIGHT};
  border-radius: 10px;
  padding: 3px;
`;

const RangeRadioButtonItem = styled.div<{
  $isSelected: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  background-color: ${({ $isSelected }) =>
    $isSelected ? WHITE : GRAY.EXTRA_LIGHT};
  padding: 5px 8px;
  transition: background-color 0.3s ease;
  cursor: pointer;
`;

type RangeRadioButtonProps = {
  items: RadioButtonValue[];
  selectedValue: any;
  onChange: (value: any) => void;
};

const RangeRadioButton = ({
  items,
  selectedValue,
  onChange,
}: RangeRadioButtonProps) => {
  const onClick = (index: number) => {
    // items 중 해당 index에 해당하는 값의 전송
    onChange(items[index].value);
  };

  return (
    <RangeRadioButtonContainer>
      {items.map((item, index) => {
        return (
          <RangeRadioButtonItem
            key={item.value}
            $isSelected={selectedValue === item.value}
            onClick={() => onClick(index)}
          >
            <MainText
              color={selectedValue === item.value ? MAIN.DEFAULT : GRAY.DARK}
            >
              {item.title}
            </MainText>
          </RangeRadioButtonItem>
        );
      })}
    </RangeRadioButtonContainer>
  );
};

export default RangeRadioButton;
