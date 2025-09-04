import React from 'react';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HOME_WIDGET } from '@mokjang/constants';
import useWindowSize from '../../../../hooks/window/window';
import HomeWidgetItem from '../../../atoms/home/home-widget-item';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { getWidgetById } from '../../../../hooks/layout/render-layout';

const WidgetList = styled.div<{ height: number }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 20px;
  max-height: ${({ height }) => `${height - 50}px`};
  overflow-y: auto;
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
  const { height } = useWindowSize();

  return (
    <DndProvider backend={HTML5Backend}>
      <WidgetList height={height}>
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
