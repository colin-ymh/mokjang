'use client';

import React, { ChangeEvent, forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';

import { BLACK, WHITE } from '@/constants/styles/color';
import DropdownItem, {
  DropdownValueType,
} from '@/components/atoms/common/dropdown/dropdown-item';
import BorderInput, {
  BorderInputProps,
} from '@/components/atoms/common/input/border-input';

import ChevronLeft from '../../../../../public/svg/chevron-down.svg';

const DropdownContainer = styled.div<{
  $isOpened: boolean;
  $isTransitionDone: boolean;
  width?: number;
}>`
  position: relative;
  z-index: ${({ $isTransitionDone }) => ($isTransitionDone ? 50 : 'auto')};
  width: ${({ width }) => (width ? `${width}px` : `100%`)};
`;

const DropdownButton = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  cursor: pointer;
  position: relative;
`;

const DropdownList = styled.div<{
  $isOpened: boolean;
  $reverseDirection?: boolean;
}>`
  position: absolute;
  margin-top: 5px;
  border-radius: 5px;
  background-color: ${WHITE};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  width: 100%;
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

const Chevron = styled(ChevronLeft)<{ $isOpened: boolean }>`
  width: 18px;
  height: 18px;
  stroke: ${BLACK};
  stroke-width: 1px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%)
    rotate(${({ $isOpened }) => ($isOpened ? '180deg' : '360deg')});
  transition: transform 0.2s ease;
`;

type DropdownViewProps = {
  items: DropdownValueType[];
  innerValue: any;
  customValue?: string;
  isCustomMode: boolean;
  focusedIndex: number;
  onFocusInput: () => void;
  isOpened: boolean;
  onClickDropdown: () => void;
  onClickItem: (value: any) => void;
  onChangeInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDownHandler: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  reverseDirection?: boolean;
  isEditable?: boolean;
  enterKeyHint: string;
  borderColor?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  disabled?: boolean;
  isChevronShown: boolean;
  isRight?: boolean;
} & BorderInputProps;

const DropdownView = forwardRef<HTMLInputElement, DropdownViewProps>(
  (
    {
      items,
      innerValue,
      customValue,
      isCustomMode,
      focusedIndex,
      onFocusInput,
      isOpened,
      onClickDropdown,
      onClickItem,
      onChangeInput,
      onKeyDownHandler,
      reverseDirection,
      isEditable,
      enterKeyHint,
      borderColor,
      width,
      height,
      backgroundColor,
      disabled,
      isChevronShown,
      fontSize,
      fontWeight,
      isRight,
      ...inputProps
    },
    ref
  ) => {
    // animate 중 z-index 유지 플래그
    const [isTransitionDone, setIsTransitionDone] = useState(false);

    // 열릴 때는 즉시 z-index 올리기
    useEffect(() => {
      if (isOpened) {
        setIsTransitionDone(true);
      }
    }, [isOpened]);

    const displayValue =
      items.find((item) => item.value === innerValue)?.title || innerValue;

    return (
      <DropdownContainer
        $isOpened={isOpened}
        $isTransitionDone={isTransitionDone}
        width={width}
      >
        <DropdownButton onClick={onClickDropdown}>
          <BorderInput
            ref={ref}
            value={isCustomMode ? customValue : displayValue}
            onChange={onChangeInput}
            onFocus={onFocusInput}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
            height={height}
            width={width}
            readOnly={!isEditable}
            enterKeyHint={enterKeyHint}
            disabled={disabled}
            onKeyDown={(event) => {
              inputProps.onKeyDown?.(event);
              if (isOpened) {
                onKeyDownHandler(event);
              }
            }}
            fontSize={fontSize}
            fontWeight={fontWeight}
            isRight={isRight}
            {...inputProps}
          />
          {isChevronShown && <Chevron $isOpened={isOpened} />}
        </DropdownButton>

        {!disabled && (
          <DropdownList
            $isOpened={isOpened}
            $reverseDirection={reverseDirection}
            onTransitionEnd={(e) => {
              // transform 애니메이션이 끝날 때
              if (e.propertyName === 'transform' && !isOpened) {
                setIsTransitionDone(false);
              }
            }}
          >
            {items.map((item, index) => (
              <DropdownItem
                key={index}
                item={item}
                onClick={onClickItem}
                isSelected={item.value === innerValue}
                isFocused={focusedIndex === index}
                isRight={isRight}
              />
            ))}
          </DropdownList>
        )}
      </DropdownContainer>
    );
  }
);

DropdownView.displayName = 'DropdownView';
export default DropdownView;
