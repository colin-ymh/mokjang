import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HOME_WIDGET } from '@/constants/constant';
import useWindowSize from '@/hooks/window/window';
import HomeWidgetItem from '@/components/atoms/home/home-widget-item';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setHomeWidgets } from '@/redux/reducers/filter/home-widget-filter-reducer';

// 그리드 레이아웃 컨테이너
const WidgetList = styled.div<{ height: number }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 20px;
  max-height: ${({ height }) => `${height - 50}px`};
  overflow-y: auto;
`;

const HomeWidgetList: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { homeWidgets } = useSelector(
    (state: RootState) => state.homeWidgetFilter
  );
  const { height } = useWindowSize();

  // 배열에서 from → to 위치로 요소 이동
  const moveWidget = useCallback(
    (from: number, to: number) => {
      // 1) 원본 배열을 복사
      const copy = [...homeWidgets];
      // 2) splice로 from 인덱스 요소를 잘라내고
      const [moved] = copy.splice(from, 1);
      // 3) to 인덱스에 잘라낸 요소를 삽입
      copy.splice(to, 0, moved);
      // 4) 업데이트 액션 디스패치
      dispatch(setHomeWidgets(copy));
    },
    [homeWidgets, dispatch] // deps 에 homeWidgets, dispatch 추가
  );

  const onClickDelete = (id: HOME_WIDGET) => {
    const newWidgets = homeWidgets.filter((widget) => widget !== id);
    dispatch(setHomeWidgets(newWidgets));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <WidgetList height={height}>
        {homeWidgets.map((widget, idx) => (
          <HomeWidgetItem
            key={widget}
            widget={widget}
            index={idx}
            moveWidget={moveWidget}
            onClickDelete={() => onClickDelete(widget)}
          />
        ))}
      </WidgetList>
    </DndProvider>
  );
};

export default HomeWidgetList;
