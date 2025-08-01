import React, { useEffect, useRef, useState } from 'react';
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from 'react-dnd';
import styled from 'styled-components';
import { MEMBER_TABLE_HEADER_ITEM } from '@/redux/reducers/filter/member-filter-reducer';

import { MEMBER } from '@/constants/column/member-column';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { getTranslatedMemberColumn } from '@/utils/translate';
import CheckButton from '@/components/atoms/common/button/check-button';

import { useI18n } from '../../../../../locales/client';

import Lock from '../../../../../public/svg/lock.svg';
import Position from '../../../../../public/svg/position.svg';
import { DND_ITEM_TYPE, HOVER_POSITION } from '@/constants/constant';
import MainTag from '@/components/atoms/common/tag/main-tag';
import { getEmptyImage } from 'react-dnd-html5-backend';

/** 아이템 컨테이너 스타일 */
const OrderItemContainer = styled.div`
  display: flex;
`;

const ItemContainer = styled.div<{
  $isFixed?: boolean;
  $isDragging?: boolean;
}>`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-radius: 5px;
  border: 1px solid ${GRAY.SEMI_LIGHT};

  //flex-shrink: 0;
  margin-bottom: 10px;
  background-color: ${({ $isFixed }) => ($isFixed ? GRAY.SUPER_LIGHT : WHITE)};
  cursor: ${({ $isFixed }) => ($isFixed ? 'not-allowed' : 'grab')};
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
`;

const InsertLineTop = styled.div`
  position: absolute;
  top: -6.8px;
  width: 100%;
  height: 2px;
  background-color: ${MAIN.LIGHT};
  z-index: 1;
`;
const InsertLineBottom = styled.div`
  position: absolute;
  bottom: -6.8px;
  width: 100%;
  height: 2px;
  background-color: ${MAIN.LIGHT};
  z-index: 1;
`;

const LockIcon = styled(Lock)`
  width: 16px;
  height: 16px;
  stroke: ${GRAY.DEFAULT};
`;

const PositionIcon = styled(Position)`
  width: 16px;
  height: 16px;
  stroke-width: 2px;
  stroke: ${GRAY.DEFAULT};
`;

type TableHeaderSettingItemViewProps = {
  item: MEMBER_TABLE_HEADER_ITEM;
  index: number;
  onDrop: (fromIndex: number, toIndex: number) => void;
  onClickHeaderItem: (id: MEMBER) => void;
};

const TableHeaderSettingItemView = ({
  item,
  index,
  onDrop,
  onClickHeaderItem,
}: TableHeaderSettingItemViewProps) => {
  const t = useI18n();
  const ref = useRef<HTMLDivElement | null>(null);
  const [hoverPosition, setHoverPosition] = useState<HOVER_POSITION>(
    HOVER_POSITION.MIDDLE
  );

  const [{ isOver }, dropRef] = useDrop<
    { index: number; id: MEMBER },
    void,
    { isOver: boolean }
  >({
    accept: DND_ITEM_TYPE.TABLE_HEADER,
    hover: (draggedItem, monitor: DropTargetMonitor) => {
      if (!ref.current) return;
      const { top, bottom } = ref.current.getBoundingClientRect();
      const height = bottom - top;
      const clientY = monitor.getClientOffset()?.y ?? 0;
      const offsetY = clientY - top;

      if (offsetY < height * 0.5) {
        setHoverPosition(HOVER_POSITION.TOP);
      } else {
        setHoverPosition(HOVER_POSITION.BOTTOM);
      }
    },
    drop: (draggedItem) => {
      const fromIndex = draggedItem.index;
      const toIndex = hoverPosition === HOVER_POSITION.TOP ? index : index + 1;

      if (fromIndex === toIndex) return;
      onDrop(fromIndex, toIndex);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const [{ isDragging }, dragRef, preview] = useDrag({
    type: DND_ITEM_TYPE.TABLE_HEADER,
    item: { index, id: item.id, title: getTranslatedMemberColumn(t, item.id) },
    canDrag: () => item.id !== MEMBER.NAME,
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  dragRef(dropRef(ref));

  return (
    <OrderItemContainer
      ref={ref}
      onClick={() => !item.isFixed && onClickHeaderItem(item.id)}
    >
      <ItemContainer $isFixed={item.isFixed} $isDragging={isDragging}>
        {hoverPosition === HOVER_POSITION.TOP && isOver && <InsertLineTop />}
        {hoverPosition === HOVER_POSITION.BOTTOM && isOver && (
          <InsertLineBottom />
        )}
        <LeftContainer>
          {item.isFixed ? <LockIcon /> : <PositionIcon />}
          <MainText color={item.isShown ? GRAY.EXTRA_DARK : GRAY.DEFAULT}>
            {getTranslatedMemberColumn(t, item.id)}
          </MainText>
          {item.isFixed && <MainTag title={t('fixed')} />}
        </LeftContainer>
        <RightContainer>
          <CheckButton
            value={item.isShown}
            onChange={() => onClickHeaderItem(item.id)}
            disabled={item.isFixed}
          />
        </RightContainer>
      </ItemContainer>
    </OrderItemContainer>
  );
};

export default TableHeaderSettingItemView;
