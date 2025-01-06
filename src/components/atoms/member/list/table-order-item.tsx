import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  setMemberFilter,
  setMemberTableHeaderItemList,
  TABLE_HEADER_ITEM,
} from '@/redux/reducers/member-filter-reducer';

import { MEMBER } from '@/constants/member/member-column';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BLACK, GRAY, MAIN } from '@/constants/styles/color';
import { NULL } from '@/constants/constant';
import { getTranslatedMemberColumn } from '@/utils/translate';

import FilledEye from '../../../../../public/svg/filled-eye.svg';
import Eye from '../../../../../public/svg/eye.svg';
import EyeSlash from '../../../../../public/svg/eye-slash.svg';
import { useI18n } from '../../../../../locales/client';

const OrderItemContainer = styled.div<{ $isFixed?: boolean }>`
  display: flex;
  padding: 10px;
  border-radius: 5px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  cursor: ${({ $isFixed }) => ($isFixed ? 'not-allowed' : 'grab')};
  position: relative;
`;

const HighlightLine = styled.div<{ $isShown: boolean }>`
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  border-radius: 5px;
  height: 2px;
  background-color: ${MAIN.LIGHT};
  display: ${({ $isShown }) => ($isShown ? 'block' : 'none')};
  //padding-bottom: ${({ $isShown }) => ($isShown ? 'block' : 'none')};
`;

const EyeIconContainer = styled.div<{ $isFixed?: boolean }>`
  display: flex;
  cursor: ${({ $isFixed }) => ($isFixed ? 'not-allowed' : 'grab')};
`;

const ITEM_TYPE = 'ORDER_ITEM';

type TableOrderItemProps = {
  item: TABLE_HEADER_ITEM;
  index: number;
  onDrag: (fromIndex: number, toIndex: number) => void;
  onChangeFilter: (id: MEMBER | typeof NULL) => void;
};

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
  const [isOver, setIsOver] = useState(false);

  const [, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    canDrag: () => !item.isFixed, // 드래그 금지 조건 추가
  });

  const [, dropRef] = useDrop({
    accept: ITEM_TYPE,
    canDrop: () => !item.isFixed, // 드롭 금지 조건 추가
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index && !item.isFixed) {
        setIsOver(true); // 강조 표시 활성화
      }
    },
    drop: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index && !item.isFixed) {
        onDrag(draggedItem.index, index);
      }
      setIsOver(false); // 드롭 후 강조 표시 제거
    },
    collect: (monitor) => {
      if (!monitor.isOver()) setIsOver(false); // 드래그 해제 시 강조 제거
    },
  });

  dragRef(dropRef(ref)); // dragRef와 dropRef 병합

  // 컬럼 활성화/비활성화 버튼 이벤트
  const onClickEye = (id: MEMBER) => {
    const newHeaderItemList = memberTableHeaderItemList
      .map((header: any) =>
        header.id === id ? { ...header, isShown: !header.isShown } : header
      )
      .sort((a: any, b: any) => {
        if (a.isShown === b.isShown) return 0; // isShown 값이 같으면 순서 유지
        return a.isShown ? -1 : 1; // true를 앞쪽으로 배치
      });

    // 헤더에서 제거
    dispatch(setMemberTableHeaderItemList(newHeaderItemList));

    // DB 요청 변경
    dispatch(
      setMemberFilter({
        ...memberFilter,
        selectedColumns: newHeaderItemList
          .filter((item) => item.isShown)
          .map((item) => {
            return item.id;
          }),
      })
    );

    // 필터 설정 부분도 함께 변경
    if (item.isFilterable && !item.isShown) onChangeFilter(item.id);
  };

  return (
    <OrderItemContainer ref={ref} $isFixed={item.isFixed}>
      <MainText color={item.isShown ? BLACK : GRAY.DEFAULT}>
        {getTranslatedMemberColumn(t, item.id)}
      </MainText>
      <EyeIconContainer
        $isFixed={item.isFixed}
        onClick={() => !item.isFixed && onClickEye(item.id)}
      >
        {item.isFixed ? <FilledEye /> : item.isShown ? <Eye /> : <EyeSlash />}
      </EyeIconContainer>
      <HighlightLine $isShown={isOver} />
    </OrderItemContainer>
  );
};

export default TableOrderItem;
