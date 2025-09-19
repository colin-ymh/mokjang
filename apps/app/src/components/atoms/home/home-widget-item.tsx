import React, { useEffect, useRef } from 'react';
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from 'react-dnd';
import styled from 'styled-components';
import {
  DND_ITEM_TYPE,
  GRAY,
  HOME_WIDGET,
  MAIN,
  MEDIA_MIN_WIDTH,
  WHITE,
} from '@mokjang/constants';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useScopedI18n } from '../../../../locales/client';
import useWindowSize from '@/hooks/window/window'; // 드래그 타입 상수

// 드래그 타입 상수
type DragItem = { index: number; id: HOME_WIDGET; title: string };

// 개별 위젯 아이템 스타일
const WidgetItem = styled.div<{ $isDragging: boolean; width: number }>`
  display: flex;
  position: relative;
  flex-direction: column;
  gap: 10px;
  height: 400px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  border: ${({ $isDragging }) =>
    `1px solid ${$isDragging ? MAIN.LIGHT : GRAY.EXTRA_LIGHT};`};
  background-color: ${WHITE};
  padding: 20px;

  // 모바일
  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    width: ${({ width }) => width - 100}px;
  }

  // 태블릿
  @media (min-width: ${MEDIA_MIN_WIDTH.TABLET}) {
    width: ${({ width }) => (width - 200) / 2}px;
  }

  // 데크스탑
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    width: ${({ width }) => (width - 450) / 3}px;
  }
`;

type DraggableWidgetProps = {
  id: HOME_WIDGET;
  index: number;
  moveWidget: (from: number, to: number) => void;
  onClickDelete: () => void;
  widget: React.ReactNode;
};

const HomeWidgetItem = ({
  id,
  index,
  moveWidget,
  onClickDelete,
  widget,
}: DraggableWidgetProps) => {
  const { width } = useWindowSize();
  const t_title = useScopedI18n('title');
  const ref = useRef<HTMLDivElement>(null);

  // drop 훅: hover 시 moveWidget 호출
  const [, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: DND_ITEM_TYPE.HOME_WIDGET,
    hover(item, monitor: DropTargetMonitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // 대상 아이템의 경계 정보
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      // 커서의 대상 내부 상대 위치
      const offsetX = clientOffset.x - left;
      const offsetY = clientOffset.y - top;

      // 가로·세로 각각 10% 여유를 뺀 중앙 80% 영역 체크
      const minX = width * 0.05;
      const maxX = width * 0.95;
      const minY = height * 0.05;
      const maxY = height * 0.95;

      // 80% 영역 밖이면 순서 변경하지 않음
      if (
        offsetX < minX ||
        offsetX > maxX ||
        offsetY < minY ||
        offsetY > maxY
      ) {
        return;
      }

      // 실제로 순서 변경
      moveWidget(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // drag 훅: index 정보 제공
  const [{ isDragging }, drag, preview] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >({
    type: DND_ITEM_TYPE.HOME_WIDGET,
    item: { index, id, title: t_title(id) },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  // 드래그 프리뷰 캡처 숨기기
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <WidgetItem ref={ref} $isDragging={isDragging} width={width}>
      {widget}
      {/*<DeleteContainer>*/}
      {/*  <DeleteButton onClick={onClickDelete} />*/}
      {/*</DeleteContainer>*/}
    </WidgetItem>
  );
};

export default HomeWidgetItem;
