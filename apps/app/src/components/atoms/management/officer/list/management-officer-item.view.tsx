import React, { useEffect, useRef, useState } from 'react';
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from 'react-dnd';
import styled from 'styled-components';

import { Officer } from '../../../../../models/management/management';
import { BLACK, GRAY, MAIN } from '../../../../../constants/styles/color';
import { MainText } from '../../../common/text/main-text';
import { SIZE } from '../../../../../constants/styles/style';
import { getEmptyImage } from 'react-dnd-html5-backend';
import {
  DND_ITEM_TYPE,
  HOVER_POSITION,
} from '../../../../../constants/constant';

const OfficerItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const OfficerItem = styled.div<{
  $level: number;
  $isDragging: boolean;
  $isSelected: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $level }) => `10px 10px 10px ${$level * 30 + 10}px`};
  transition: background-color 0.3s;
  border-radius: 5px;
  background-color: ${({ $isSelected }) => $isSelected && MAIN.EXTRA_LIGHT};
  cursor: pointer;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.3 : 1)};
`;

const InsertLineTop = styled.div<{ $level: number }>`
  position: absolute;
  top: -1.5px;
  left: ${({ $level }) => `${$level * 30}px`};
  width: 100%;
  height: 2px;
  background-color: ${MAIN.LIGHT};
  z-index: 1;
`;
const InsertLineBottom = styled.div<{ $level: number }>`
  position: absolute;
  bottom: -1.5px;
  left: ${({ $level }) => `${$level * 30}px`};
  width: 100%;
  height: 2px;
  background-color: ${MAIN.LIGHT};
  z-index: 1;
`;

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

type ManagementOfficerItemViewProps = {
  officer: Officer;
  selectedOfficerId: string | null;
  level: number;
  onDropOfficer: (
    dragged: Officer,
    order: number,
    newParentOfficerId?: string | null
  ) => void;
  onClickOfficer: (officer: Officer) => void;
};

const ManagementOfficerItemView: React.FC<ManagementOfficerItemViewProps> = ({
  officer,
  selectedOfficerId,
  level,
  onDropOfficer,
  onClickOfficer,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [hoverPosition, setHoverPosition] = useState<HOVER_POSITION>(
    HOVER_POSITION.MIDDLE
  );

  const [{ isOver }, dropRef] = useDrop<Officer, void, { isOver: boolean }>({
    accept: DND_ITEM_TYPE.GROUP,
    hover(item: Officer, monitor: DropTargetMonitor) {
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
    drop(item: Officer) {
      if (item.id === officer.id) return;
      switch (hoverPosition) {
        case HOVER_POSITION.BOTTOM:
          // 원래 윗 순서였으면, 아래로 이동
          if (item.order > officer.order) {
            onDropOfficer(item, officer.order + 1);
          }
          // 원래 아랫 순서였으면, 해당 위치로 이동
          else {
            onDropOfficer(item, officer.order);
          }

          return;
        case HOVER_POSITION.TOP:
          // 원래 윗 순서였으면, 아래로 이동
          if (item.order > officer.order) {
            onDropOfficer(item, officer.order);
          }
          // 원래 아랫 순서였으면, 해당 위치로 이동
          else {
            onDropOfficer(item, officer.order - 1);
          }
          return;
      }
    },
    collect: (m) => ({ isOver: m.isOver({ shallow: true }) }),
  });

  const [{ isDragging }, dragRef, preview] = useDrag<
    Officer,
    void,
    { isDragging: boolean }
  >({
    type: DND_ITEM_TYPE.GROUP,
    item: officer,
    collect: (m: DragSourceMonitor) => ({ isDragging: m.isDragging() }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  dragRef(dropRef(ref));

  return (
    <OfficerItemContainer ref={ref}>
      {hoverPosition === HOVER_POSITION.TOP && isOver && (
        <InsertLineTop $level={level} />
      )}
      {hoverPosition === HOVER_POSITION.BOTTOM && isOver && (
        <InsertLineBottom $level={level} />
      )}

      <OfficerItem
        onClick={() => onClickOfficer(officer)}
        $level={level}
        $isDragging={isDragging}
        $isSelected={selectedOfficerId === officer.id}
      >
        <NameContainer>
          <MainText
            color={selectedOfficerId === officer.id ? MAIN.DEFAULT : BLACK}
          >
            {officer.name}
          </MainText>
          <MainText size={SIZE.EXTRA_SMALL} color={GRAY.DEFAULT}>
            {officer.membersCount}
          </MainText>
        </NameContainer>
      </OfficerItem>
    </OfficerItemContainer>
  );
};

export default ManagementOfficerItemView;
