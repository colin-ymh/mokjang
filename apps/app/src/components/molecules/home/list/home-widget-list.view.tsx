import React from 'react';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HOME_WIDGET, MEDIA_MIN_WIDTH } from '@mokjang/constants';
import HomeWidgetItem from '../../../atoms/home/home-widget-item';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getWidgetById } from '@/hooks/layout/render-layout';

/* 위젯 사이 간격 없이 딱 붙도록 수정 */
const WidgetList = styled.div`
  display: grid;

  row-gap: 30px;
  column-gap: 30px;
  padding: 30px;
  overflow: auto;

  align-content: start; /* 컨테이너 안 남는 공간을 늘려 쓰지 않음 */
  align-items: start; /* 각 아이템의 세로 정렬 */
  justify-content: start;

  // 모바일
  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    grid-template-columns: repeat(1, 1fr);
  }

  // 태블릿
  @media (min-width: ${MEDIA_MIN_WIDTH.TABLET}) {
    grid-template-columns: repeat(2, 1fr);
  }

  // 데크스탑
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
type HomeWidgetListViewProps = {
  moveWidget: (from: number, to: number) => void;
  onClickDelete: (widget: HOME_WIDGET) => void;
};

const HomeWidgetListView = ({
  moveWidget,
  onClickDelete,
}: HomeWidgetListViewProps) => {
  const { homeWidgets } = useSelector(
    (state: RootState) => state.homeWidgetFilter
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <WidgetList>
        {homeWidgets.map((widget, idx) => (
          <HomeWidgetItem
            key={widget}
            id={widget}
            index={idx}
            moveWidget={moveWidget}
            onClickDelete={() => onClickDelete(widget)}
            widget={getWidgetById(widget)}
          />
        ))}
      </WidgetList>
    </DndProvider>
  );
};

export default HomeWidgetListView;
