import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  setMemberFilter,
  setMemberTableHeaderItemList,
  TABLE_HEADER_ITEM,
} from '@/redux/reducers/filter/member-filter-reducer';

import { MEMBER } from '@/constants/column/member-column';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BLACK, GRAY, MAIN } from '@/constants/styles/color';
import { NULL } from '@/constants/constant';
import { getTranslatedMemberColumn } from '@/utils/translate';
import ToggleButton from '@/components/atoms/common/button/toggle-button';

import { useI18n } from '../../../../../locales/client';

/** 아이템을 드래그할 때의 타입 식별자 */
const ITEM_TYPE = 'ORDER_ITEM';

/** 드래그 & 드롭용 Props */
type TableOrderItemProps = {
  item: TABLE_HEADER_ITEM;
  index: number;
  /** fromIndex -> toIndex로 아이템을 옮기는 콜백 */
  onDrag: (fromIndex: number, toIndex: number) => void;
  /** 필터 변경 콜백 */
  onChangeFilter: (id: MEMBER | typeof NULL) => void;
};

/** 아이템 컨테이너 스타일 */
const OrderItemContainer = styled.div<{
  $isFixed?: boolean;
  $isDragging?: boolean;
}>`
  display: flex;
  padding: 10px;
  border-radius: 5px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  position: relative;

  cursor: ${({ $isFixed }) => ($isFixed ? 'not-allowed' : 'grab')};

  /* 드래그 중 반투명 처리 */
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
  transition: opacity 0.2s ease;
`;

/** 하이라이트 라인 스타일 */
const HighlightLine = styled.div<{ $isShown: boolean }>`
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  border-radius: 5px;
  height: 2px;
  background-color: ${MAIN.LIGHT};

  /* isShown일 때 나타나도록, 부드러운 트랜지션 */
  opacity: ${({ $isShown }) => ($isShown ? 1 : 0)};
  transform: ${({ $isShown }) => ($isShown ? 'scaleY(1)' : 'scaleY(0)')};
  transform-origin: bottom;
  transition:
    opacity 0.2s,
    transform 0.2s;
`;

const TableOrderItem = ({
  item,
  index,
  onDrag,
  onChangeFilter,
}: TableOrderItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { memberTableHeaderItemList, memberFilter } = useSelector(
    (state: RootState) => state.memberFilter
  );
  const t = useI18n();

  const ref = useRef<HTMLDivElement | null>(null);

  /** 드래그 훅: isDragging을 collect로 받아와 스타일에 활용 */
  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    canDrag: () => !item.isFixed,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  /** 드롭 훅: hover 시 표시, drop 시 onDrag 호출 */
  const [{ isOver }, dropRef] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem: { index: number }) => {
      // 필요시 hover 로직
    },
    drop: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        onDrag(draggedItem.index + 1, index + 2);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // dragRef + dropRef 병합
  dragRef(dropRef(ref));

  /** 토글 버튼 클릭 시, 컬럼 활성화/비활성 처리 */
  const onClickToggle = (id: MEMBER) => {
    const newHeaderItemList = memberTableHeaderItemList
      .map((header) =>
        header.id === id ? { ...header, isShown: !header.isShown } : header
      )
      .sort((a, b) => {
        if (a.isShown === b.isShown) return 0;
        return a.isShown ? -1 : 1;
      });

    dispatch(setMemberTableHeaderItemList(newHeaderItemList));

    dispatch(
      setMemberFilter({
        ...memberFilter,
        selectedColumns: newHeaderItemList
          .filter((item) => item.isShown)
          .map((item) => item.id),
      })
    );

    if (item.isFilterable && !item.isShown) onChangeFilter(item.id);
  };

  return (
    <OrderItemContainer
      ref={ref}
      $isFixed={item.isFixed}
      $isDragging={isDragging}
    >
      <MainText color={item.isShown ? BLACK : GRAY.DEFAULT}>
        {getTranslatedMemberColumn(t, item.id)}
      </MainText>

      {!item.isFixed && (
        <ToggleButton
          value={item.isShown}
          onClick={() => onClickToggle(item.id)}
        />
      )}

      <HighlightLine $isShown={isOver} />
    </OrderItemContainer>
  );
};

export default TableOrderItem;
