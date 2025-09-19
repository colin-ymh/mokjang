import React from 'react';
import { useDragLayer, XYCoord } from 'react-dnd';
import styled from 'styled-components';
import { MainText } from '@mokjang/components';
import { GRAY } from '@mokjang/constants';
import { DND_ITEM_TYPE } from '@mokjang/constants';

// attrs로 style 프로퍼티만 동적으로 처리
const LayerContainer = styled.div.attrs<{ x: number; y: number }>((props) => ({
  style: {
    transform: `translate(${props.x}px, ${props.y}px)`,
    opacity: 0.1,
    pointerEvents: 'none',
  },
}))<{ x: number; y: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
`;

const PreviewBox = styled.div`
  display: flex;
  padding: 4px 8px;
  background-color: white;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  width: 300px;
`;

export const CustomDragLayer: React.FC = () => {
  const { item, itemType, isDragging, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem<any>(),
      itemType: monitor.getItemType(),
      isDragging: monitor.isDragging(),
      currentOffset: monitor.getSourceClientOffset(),
    })
  );

  if (itemType !== DND_ITEM_TYPE.GROUP || !isDragging || !currentOffset)
    return null;
  const { x, y } = currentOffset as XYCoord;

  return (
    <LayerContainer x={x} y={y}>
      <PreviewBox>
        <MainText>{item.name}</MainText>
      </PreviewBox>
    </LayerContainer>
  );
};

export default CustomDragLayer;
