import React, { useEffect, useRef, useState } from 'react';
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from 'react-dnd';
import styled from 'styled-components';

import { Group } from '@/models/management/management';
import { BLACK, GRAY, MAIN } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import Plus from '../../../../../../public/svg/plus.svg';
import { SIZE } from '@/constants/styles/style';
import { useI18n } from '../../../../../../locales/client';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { ALL, DND_ITEM_TYPE, HOVER_POSITION } from '@/constants/constant';

const GroupItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const GroupItem = styled.div<{
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

const NestInsertHighlight = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${MAIN.EXTRA_LIGHT};
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
const PlusButton = styled(Plus)`
  width: 18px;
  height: 18px;
  stroke: ${GRAY.DARK};
  stroke-width: 2px;
  border-radius: 5px;
  padding: 1px;
  cursor: pointer;
  &:hover {
    background-color: ${GRAY.SEMI_LIGHT};
  }
`;

type ManagementGroupItemViewProps = {
  isHaveChildren?: boolean;
  isOpen: boolean;
  group: Group;
  level: number;
  selectedGroupId: string | null;
  onDropGroup: (
    dragged: Group,
    order: number,
    newParentGroupId?: string | null
  ) => void;
  onClickToggle: (id: string) => void;
  onClickGroup: (group: Group) => void;
  onClickGroupAdd: () => void;
};

const ManagementGroupItemView: React.FC<ManagementGroupItemViewProps> = ({
  isHaveChildren,
  isOpen,
  group,
  level,
  selectedGroupId,
  onDropGroup,
  onClickToggle,
  onClickGroup,
  onClickGroupAdd,
}) => {
  const t = useI18n();
  const ref = useRef<HTMLDivElement | null>(null);

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isSameParent, setIsSameParent] = useState<boolean>(false);
  const [hoverPosition, setHoverPosition] = useState<HOVER_POSITION>(
    HOVER_POSITION.MIDDLE
  );

  const [{ isOver }, dropRef] = useDrop<Group, void, { isOver: boolean }>({
    accept: DND_ITEM_TYPE.GROUP,
    hover(item: Group, monitor: DropTargetMonitor) {
      if (!ref.current) return;
      const { top, bottom } = ref.current.getBoundingClientRect();
      const height = bottom - top;
      const clientY = monitor.getClientOffset()?.y ?? 0;
      const offsetY = clientY - top;

      setIsSameParent(item.parentGroupId === group.parentGroupId);

      if (offsetY < height * 0.2) {
        setHoverPosition(HOVER_POSITION.TOP);
      } else if (offsetY > height * 0.8) {
        setHoverPosition(HOVER_POSITION.BOTTOM);
      } else {
        setHoverPosition(HOVER_POSITION.MIDDLE);
      }
    },
    drop(item: Group) {
      if (item.id === group.id) return;
      switch (hoverPosition) {
        case HOVER_POSITION.MIDDLE:
          // 이미 해당 부모의 자식이면 제외
          if (item.parentGroupId === group.id) {
            return;
          }
          // 대상 그룹의 자식이 있다면, 맨 하단으로
          if (group.childGroups && group.childGroups.length > 0) {
            onDropGroup(
              item,
              group.childGroups[group.childGroups.length - 1].order + 1,
              group.id
            );
          }
          // 없다면, order 를 1로 지정
          else {
            onDropGroup(item, 1, group.id);
          }
          return;
        case HOVER_POSITION.BOTTOM:
          // 부모가 같으면
          if (isSameParent) {
            // 자식이 있으면, 첫번째 자식으로 지정
            if (group.childGroups && group.childGroups.length > 0) {
              onDropGroup(item, 1, group.id);
            }
            // 자식이 없으면 순서만 변경
            else {
              // 원래 윗 순서였으면, 아래로 이동
              if (item.order > group.order) {
                onDropGroup(item, group.order + 1);
              }
              // 원래 아랫 순서였으면, 해당 위치로 이동
              else {
                onDropGroup(item, group.order);
              }
            }
          }
          // 부모가 다르면, 해당 대상의 부모로 이동 + 순서 변경
          else {
            // 이미 대상이 부모인 경우에는, 첫번째 자식으로 이동
            if (item.parentGroupId === group.id) {
              onDropGroup(item, 1);
            }
            // 자식이 있는 경우, 자식의 맨 위로 삽입
            else if (group.childGroups && group.childGroups.length > 0) {
              onDropGroup(item, group.childGroups[0].order, group.id);
            }
            // 자식이 없는 경우, 형제로 삽입
            else {
              onDropGroup(item, group.order + 1, group.parentGroupId);
            }
          }

          return;
        case HOVER_POSITION.TOP:
          // 부모가 같으면
          if (isSameParent) {
            // 원래 윗 순서였으면, 아래로 이동
            if (item.order > group.order) {
              onDropGroup(item, group.order);
            }
            // 원래 아랫 순서였으면, 해당 위치로 이동
            else {
              onDropGroup(item, group.order - 1);
            }
          }
          // 부모가 다르면, 해당 대상의 부모로 이동 + 순서 변경
          else {
            onDropGroup(item, group.order, group.parentGroupId);
          }

          return;
      }
    },
    collect: (m) => ({ isOver: m.isOver({ shallow: true }) }),
  });

  const [{ isDragging }, dragRef, preview] = useDrag<
    Group,
    void,
    { isDragging: boolean }
  >({
    type: DND_ITEM_TYPE.GROUP,
    item: group,
    collect: (m: DragSourceMonitor) => ({ isDragging: m.isDragging() }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  dragRef(dropRef(ref));

  return (
    <GroupItemContainer
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {hoverPosition === HOVER_POSITION.TOP && isOver && (
        <InsertLineTop $level={level} />
      )}
      {hoverPosition === HOVER_POSITION.BOTTOM && isOver && (
        <InsertLineBottom
          $level={
            group.childGroups && group.childGroups.length > 0
              ? level + 1
              : level
          }
        />
      )}
      {hoverPosition === HOVER_POSITION.MIDDLE && isOver && (
        <NestInsertHighlight />
      )}

      <GroupItem
        onClick={() => onClickGroup(group)}
        $level={level}
        $isDragging={isDragging}
        $isSelected={selectedGroupId === group.id}
      >
        <LeftContainer>
          <ToggleButton
            onClick={(e) => {
              e.stopPropagation();
              onClickToggle(group.id!);
            }}
          >
            <MainText size={SIZE.EXTRA_SMALL} color={GRAY.DEFAULT}>
              {isHaveChildren ? (isOpen ? '▼' : '▶') : '⦁'}
            </MainText>
          </ToggleButton>

          <NameContainer>
            <MainText
              color={selectedGroupId === group.id ? MAIN.DEFAULT : BLACK}
            >
              {group.id === null
                ? t('none')
                : group.id === ALL
                  ? t(ALL)
                  : group.name}
            </MainText>
            <MainText size={SIZE.EXTRA_SMALL} color={GRAY.DEFAULT}>
              {group.membersCount}
            </MainText>
          </NameContainer>
        </LeftContainer>

        <RightContainer>
          {isHovered && <PlusButton onClick={onClickGroupAdd} />}
        </RightContainer>
      </GroupItem>
    </GroupItemContainer>
  );
};

export default ManagementGroupItemView;
