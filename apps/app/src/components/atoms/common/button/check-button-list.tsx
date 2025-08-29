import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CheckButton from './check-button';
import { MainText } from '../text/main-text';
import { GRAY, MAIN } from '@/constants/styles/color';

const CheckButtonListContainer = styled.div<{ $gridCount: number }>`
  display: grid;
  width: 100%;
  grid-template-columns: ${({ $gridCount }) => `repeat(${$gridCount}, 1fr)`};
  gap: 10px;
`;

const CheckItem = styled.div`
  display: flex;
  padding: 13px;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  &:hover {
    background-color: ${MAIN.EXTRA_LIGHT};
  }
`;

export type CheckButtonValue = {
  value: any; // 실제 사용될 값
  title: string; // 라디오 버튼에서 표시될 title
};

type CheckButtonListProps = {
  values: any[];
  onChange: (values: any[]) => void; // 변경 시 호출될 콜백
  items: CheckButtonValue[];
  gridCount?: number;
};

const CheckButtonList = ({
  values,
  onChange,
  items,
  gridCount = 2,
}: CheckButtonListProps) => {
  const [selectedItems, setSelectedItems] = useState<any[]>(values);

  const onClickItem = (value: any) => {
    if (selectedItems.includes(value)) {
      setSelectedItems(selectedItems.filter((v) => v !== value));
    } else {
      setSelectedItems([...selectedItems, value]);
    }
  };

  useEffect(() => {
    onChange(selectedItems);
  }, [selectedItems]);

  return (
    <CheckButtonListContainer $gridCount={gridCount}>
      {items.map((item) => (
        <CheckItem key={item.value} onClick={() => onClickItem(item.value)}>
          <CheckButton value={selectedItems.includes(item.value)} />
          <MainText color={GRAY.DARK}>{item.title}</MainText>
        </CheckItem>
      ))}
    </CheckButtonListContainer>
  );
};

export default CheckButtonList;
