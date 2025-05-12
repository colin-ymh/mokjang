'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { BLACK, WHITE } from '@/constants/styles/color';
import DropdownItem, {
  DropdownValueType,
} from '@/components/atoms/common/dropdown/dropdown-item';

import Kebab from '../../../../../public/svg/kebab.svg';

const DropdownContainer = styled.div<{
  $isOpened: boolean;
  $isTransitionDone: boolean;
  width?: number;
}>`
  position: relative;
  z-index: ${({ $isTransitionDone }) => ($isTransitionDone ? 50 : 'auto')};
`;

const DropdownButton = styled.div`
  display: flex;
  width: 100%;
  cursor: pointer;
  //position: relative;
`;

const DropdownList = styled.div<{
  $isOpened: boolean;
  $reverseDirection?: boolean;
  width?: number;
}>`
  position: absolute;
  margin-top: 5px;
  right: 0;
  border-radius: 5px;
  background-color: ${WHITE};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  width: ${({ width }) => (width ? `${width}px` : `auto`)};
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: auto;
  max-height: 200px;
  bottom: ${({ $reverseDirection }) => ($reverseDirection ? '55px' : 'auto')};

  /* 애니메이션 */
  transform-origin: ${({ $reverseDirection }) =>
    $reverseDirection ? 'bottom' : 'top'};
  transform: scaleY(${({ $isOpened }) => ($isOpened ? 1 : 0)});
  opacity: ${({ $isOpened }) => ($isOpened ? 1 : 0)};
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
  pointer-events: ${({ $isOpened }) => ($isOpened ? 'auto' : 'none')};
`;

const KebabButton = styled(Kebab)`
  width: 25px;
  height: 25px;
  stroke: ${BLACK};
  stroke-width: 1px;
`;

export type KebabDropdownValueType = DropdownValueType & {
  onClick: () => void;
};

type KebabDropdownViewProps = {
  items: KebabDropdownValueType[];
  focusedIndex: number;
  isOpened: boolean;
  onClickKebab: () => void;

  width?: number;
};

const KebabDropdownView = ({
  items,
  focusedIndex,
  isOpened,
  width,
  onClickKebab,
}: KebabDropdownViewProps) => {
  // animate 중 z-index 유지 플래그
  const [isTransitionDone, setIsTransitionDone] = useState(false);

  // 열릴 때는 즉시 z-index 올리기
  useEffect(() => {
    if (isOpened) {
      setIsTransitionDone(true);
    }
  }, [isOpened]);

  return (
    <DropdownContainer
      $isOpened={isOpened}
      $isTransitionDone={isTransitionDone}
    >
      <DropdownButton
        onClick={(event: any) => {
          event.stopPropagation();
          onClickKebab();
        }}
      >
        <KebabButton />
      </DropdownButton>

      <DropdownList
        $isOpened={isOpened}
        onTransitionEnd={(e) => {
          // transform 애니메이션이 끝날 때
          if (e.propertyName === 'transform' && !isOpened) {
            setIsTransitionDone(false);
          }
        }}
        width={width}
      >
        {items.map((item, index) => (
          <DropdownItem
            key={index}
            item={item}
            onClick={() => {
              item.onClick();
              onClickKebab();
            }}
            isSelected={false}
            isFocused={focusedIndex === index}
          />
        ))}
      </DropdownList>
    </DropdownContainer>
  );
};

export default KebabDropdownView;
