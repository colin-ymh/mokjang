import React, { useEffect, useRef, useState } from 'react';
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from 'react-dnd';
import styled from 'styled-components';

import { Group } from '@/models/management/management';
import { GRAY, MAIN } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import Plus from '../../../../../public/svg/plus.svg';
import { SIZE } from '@/constants/styles/style';
import { useI18n } from '../../../../../locales/client';
import { getEmptyImage } from 'react-dnd-html5-backend';

// 컨테이너: 드래그 상태에 따라 반투명 적용
const GroupItemContainer = styled.div<{ $isDragging: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  position: relative;
  background-color: ${({ $isDragging }) => $isDragging && GRAY.LIGHT};
`;

// 그룹 아이템: 레벨별 들여쓰기 및 기본 스타일
const GroupItem = styled.div<{ $level: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $level }) => `10px 10px 10px ${$level * 30}px`};
  transition: background-color 0.3s;
  border-radius: 5px;
  cursor: pointer;
`;

// 위/아래에 삽입선을 하나로 보이도록 위치 조정
const InsertLineTop = styled.div`
  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: ${MAIN.DEFAULT};
  z-index: 1;
`;
const InsertLineBottom = styled.div`
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: ${MAIN.DEFAULT};
  z-index: 1;
`;

// 자식으로 삽입 가능한 영역 하이라이트
const NestInsertHighlight = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 128, 255, 0.1);
  border: 1px dashed ${MAIN.DEFAULT};
  border-radius: 4px;
  z-index: 0;
`;

// 좌우 컨테이너
const LeftContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;
const RightContainer = styled.div`
  display: flex;
  align-items: center;
`;

// 토글/추가 버튼
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

// 컴포넌트 Props 타입 정의
type ManagementGroupItemViewProps = {
  isHaveChildren?: boolean;
  isOpen: boolean;
  group: Group;
  level: number;
  onDropGroup: (dragged: Group, order: number, canNest: boolean) => void;
  onClickToggle: (id: string) => void;
  onClickGroup: (id: string) => void;
  onClickGroupAdd: () => void;
};

/**
 * 순수 UI 컴포넌트: 그룹 항목 드래그/드롭, 삽입선, 네스트 하이라이트 렌더링
 */
const ManagementGroupItemView: React.FC<ManagementGroupItemViewProps> = ({
  isHaveChildren,
  isOpen,
  group,
  level,
  onDropGroup,
  onClickToggle,
  onClickGroup,
  onClickGroupAdd,
}) => {
  const t = useI18n();
  const ref = useRef<HTMLDivElement | null>(null);
  const ITEM_TYPE = 'GROUP_ITEM';

  // 부모 동일 여부, 네스트 가능 여부, 삽입 위치 상태
  const [isSameParent, setIsSameParent] = useState(false);
  const [canNest, setCanNest] = useState(false);
  const hoverTimer = useRef<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<'top' | 'bottom'>('top');

  // useDrop: hover 위치 계산 및 drop 시 호출
  const [{ isOver }, dropRef] = useDrop<Group, void, { isOver: boolean }>({
    accept: ITEM_TYPE,
    hover(item: Group, monitor: DropTargetMonitor) {
      // 동일 부모인지 확인
      setIsSameParent(item.parentGroupId === group.parentGroupId);
      if (!ref.current) return;
      const { top, bottom } = ref.current.getBoundingClientRect();
      const midY = (bottom - top) / 2;
      const clientY = monitor.getClientOffset()?.y ?? 0;
      setHoverPosition(clientY - top < midY ? 'top' : 'bottom');
    },
    drop(item: Group) {
      // order 결정: 위/아래
      const order = hoverPosition === 'top' ? group.order : group.order + 1;
      // 타이머 클리어
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      onDropGroup(item, order, canNest);
      setCanNest(false);
    },
    collect: (m) => ({ isOver: m.isOver({ shallow: true }) }),
  });

  // useDrag: 드래그 상태 추적
  const [{ isDragging }, dragRef, preview] = useDrag<
    Group,
    void,
    { isDragging: boolean }
  >({
    type: ITEM_TYPE,
    item: group,
    collect: (m: DragSourceMonitor) => ({ isDragging: m.isDragging() }),
    end: () => {
      // drag 종료 시 네스트 플래그 초기화
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      setCanNest(false);
    },
  });

  // hover 진입/이탈에 따른 네스트 모드 토글
  useEffect(() => {
    if (isOver) {
      hoverTimer.current = window.setTimeout(() => setCanNest(true), 700);
    } else {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      setCanNest(false);
    }
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, [isOver]);

  // 드래그 프리뷰 캡처 숨기기
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  // drag + drop 레퍼런스 연결
  dragRef(dropRef(ref));

  return (
    <GroupItemContainer ref={ref} $isDragging={isDragging}>
      {/* 동일 부모, 드롭 가능, 위/아래 위치에 따라 삽입선 렌더링 */}
      {group.id &&
        isSameParent &&
        !canNest &&
        isOver &&
        hoverPosition === 'top' && <InsertLineTop />}
      {isSameParent && !canNest && isOver && hoverPosition === 'bottom' && (
        <InsertLineBottom />
      )}
      {/* 자식 삽입 가능 모드 하이라이트 */}
      {canNest && <NestInsertHighlight />}

      <GroupItem onClick={() => onClickGroup(group.id!)} $level={level}>
        <LeftContainer>
          {/* 펼침/접힘 토글 */}
          <ToggleButton
            onClick={(e) => {
              e.stopPropagation();
              onClickToggle(group.id!);
            }}
          >
            <MainText size={SIZE.EXTRA_SMALL}>
              {isHaveChildren ? (isOpen ? '▼' : '▶') : '⦁'}
            </MainText>
          </ToggleButton>

          {/* 그룹 이름 및 멤버 수 */}
          <NameContainer>
            <MainText>{group.name || t('all')}</MainText>
            <MainText size={SIZE.EXTRA_SMALL} color={GRAY.DEFAULT}>
              {group.membersCount}
            </MainText>
          </NameContainer>
        </LeftContainer>

        {/* 그룹 추가 버튼 */}
        <RightContainer>
          <PlusButton onClick={onClickGroupAdd} />
        </RightContainer>
      </GroupItem>
    </GroupItemContainer>
  );
};

export default ManagementGroupItemView;
