import React, { useEffect, useRef, useState } from 'react';
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from 'react-dnd';
import styled from 'styled-components';

import { Officer } from '@/models/management/management';
import { GRAY, MAIN } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { useI18n } from '../../../../../../locales/client';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { DND_ITEM_TYPE, HOVER_POSITION } from '@/constants/constant';

const OfficerItemContainer = styled.div<{ $isDragging: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  position: relative;
  background-color: ${({ $isDragging }) => $isDragging && GRAY.LIGHT};
`;

const OfficerItem = styled.div<{ $level: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $level }) => `10px 10px 10px ${$level * 30}px`};
  transition: background-color 0.3s;
  border-radius: 5px;
  cursor: pointer;
`;

const InsertLineTop = styled.div<{ $level: number }>`
  position: absolute;
  top: -1.5px;
  left: ${({ $level }) => `${$level * 30}px`};
  width: 100%;
  height: 2px;
  background-color: ${MAIN.DEFAULT};
  z-index: 1;
`;
const InsertLineBottom = styled.div<{ $level: number }>`
  position: absolute;
  bottom: -1.5px;
  left: ${({ $level }) => `${$level * 30}px`};
  width: 100%;
  height: 2px;
  background-color: ${MAIN.DEFAULT};
  z-index: 1;
`;

const NestInsertHighlight = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${MAIN.LIGHT};
  opacity: 0.5;
  border: 1px dashed ${MAIN.DEFAULT};
  border-radius: 4px;
  z-index: 0;
`;

const LeftContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;
const RightContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleButton = styled.div`
  display: flex;
  cursor: pointer;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
`;
const NameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

type ManagementOfficerItemViewProps = {
  isOpen: boolean;
  officer: Officer;
  level: number;
  onDropOfficer: (
    dragged: Officer,
    order: number,
    newParentOfficerId?: string | null
  ) => void;
  onClickToggle: (id: string) => void;
  onClickOfficer: (id: string) => void;
};

const ManagementOfficerItemView: React.FC<ManagementOfficerItemViewProps> = ({
  isOpen,
  officer,
  level,
  onDropOfficer,
  onClickToggle,
  onClickOfficer,
}) => {
  const t = useI18n();
  const ref = useRef<HTMLDivElement | null>(null);

  const [isHovered, setIsHovered] = useState<boolean>(false);
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
    <OfficerItemContainer
      ref={ref}
      $isDragging={isDragging}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {hoverPosition === HOVER_POSITION.TOP && isOver && (
        <InsertLineTop $level={level} />
      )}
      {hoverPosition === HOVER_POSITION.BOTTOM && isOver && (
        <InsertLineBottom $level={level} />
      )}
      {hoverPosition === HOVER_POSITION.MIDDLE && isOver && (
        <NestInsertHighlight />
      )}

      <OfficerItem onClick={() => onClickOfficer(officer.id!)} $level={level}>
        <LeftContainer>
          <ToggleButton
            onClick={(e) => {
              e.stopPropagation();
              onClickToggle(officer.id!);
            }}
          >
            <MainText size={SIZE.EXTRA_SMALL}>{'⦁'}</MainText>
          </ToggleButton>

          <NameContainer>
            <MainText>{officer.name || t('all')}</MainText>
            <MainText size={SIZE.EXTRA_SMALL} color={GRAY.DEFAULT}>
              {officer.membersCount}
            </MainText>
          </NameContainer>
        </LeftContainer>

        <RightContainer></RightContainer>
      </OfficerItem>
    </OfficerItemContainer>
  );
};

export default ManagementOfficerItemView;
