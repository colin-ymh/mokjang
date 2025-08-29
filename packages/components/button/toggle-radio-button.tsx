import styled from 'styled-components';
import { GRAY, MAIN, WHITE } from '@mokjang/constants';
import { MainText } from '../text/main-text';

const ToggleRadioButtonContainer = styled.div<{ $backgroundColor: string }>`
  display: flex;
  flex-direction: row;
  flex-wrap: inherit;
  gap: 2px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 10px;
  padding: 3px;
`;

const ToggleRadioButtonItem = styled.div<{
  $isSelected: boolean;
  $rowPadding?: number;
  $columnPadding?: number;
  $toggleBackgroundColor?: string;
  $backgroundColor?: string;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  background-color: ${({
    $isSelected,
    $toggleBackgroundColor,
    $backgroundColor,
  }) => ($isSelected ? $toggleBackgroundColor : $backgroundColor)};
  padding: ${({ $rowPadding, $columnPadding }) =>
    `${$columnPadding}px ${$rowPadding}px`};
  transition: background-color 0.3s ease;
  cursor: pointer;
`;

export type RadioButtonValue = {
  value: any; // 실제 사용될 값
  title: string; // 라디오 버튼에서 표시될 title
};

type ToggleRadioButtonProps = {
  items: RadioButtonValue[];
  selectedValue: any;
  onChange: (value: any) => void;
  rowPadding?: number;
  columnPadding?: number;
  backgroundColor?: string;
  toggleBackgroundColor?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
};

export const ToggleRadioButton = ({
  items,
  selectedValue,
  onChange,
  rowPadding = 5,
  columnPadding = 8,
  backgroundColor = GRAY.EXTRA_LIGHT,
  toggleBackgroundColor = WHITE,
  color = MAIN.DEFAULT,
  fontSize = 14,
  fontWeight = 500,
}: ToggleRadioButtonProps) => {
  const onClick = (index: number) => {
    // items 중 해당 index에 해당하는 값의 전송
    onChange(items[index].value);
  };

  return (
    <ToggleRadioButtonContainer $backgroundColor={backgroundColor}>
      {items.map((item, index) => {
        return (
          <ToggleRadioButtonItem
            key={item.value}
            $isSelected={selectedValue === item.value}
            onClick={() => onClick(index)}
            $rowPadding={rowPadding}
            $columnPadding={columnPadding}
            $toggleBackgroundColor={toggleBackgroundColor}
            $backgroundColor={backgroundColor}
          >
            <MainText
              color={selectedValue === item.value ? color : GRAY.DARK}
              fontSize={fontSize}
              fontWeight={fontWeight}
            >
              {item.title}
            </MainText>
          </ToggleRadioButtonItem>
        );
      })}
    </ToggleRadioButtonContainer>
  );
};
