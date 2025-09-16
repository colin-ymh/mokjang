'use client';

import React, {
  ChangeEvent,
  forwardRef,
  MutableRefObject,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

import { WHITE } from '@mokjang/constants';
import DropdownItem, { DropdownValueType } from './dropdown-item';
import { BorderInputProps } from '@mokjang/components';
import DefaultDropdownButton from './default-dropdown-button';

const DropdownContainer = styled.div<{
  $isOpened: boolean;
  $isTransitionDone: boolean;
  width?: number;
}>`
  position: relative;
  z-index: ${({ $isTransitionDone }) => ($isTransitionDone ? 50 : 'auto')};
  width: ${({ width }) => (width ? `${width}px` : `100%`)};
`;
const DropdownList = styled.div<{
  $isOpened: boolean;
  $reverseDirection?: boolean;
  $height: number;
  $listHeight?: number;
}>`
  position: absolute;
  margin-top: 5px;
  border-radius: 5px;
  background-color: ${WHITE};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${({ $listHeight }) => $listHeight}px;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: auto;
  max-height: 200px;
  bottom: ${({ $reverseDirection, $height }) =>
    $reverseDirection ? `${$height}px` : 'auto'};
  top: ${({ $reverseDirection, $height }) =>
    $reverseDirection ? 'auto' : `${$height}px`};

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

type DropdownViewProps = {
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScrollList: () => void;
  items: DropdownValueType[];
  innerValue: any;
  customValue?: string;
  isCustomMode: boolean;
  focusedIndex: number;
  onFocusInput: () => void;
  isOpened: boolean;
  onClickDropdown: (event: React.MouseEvent<HTMLDivElement>) => void;
  onClickItem: (value: any) => void;
  onChangeInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDownHandler: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  reverseDirection?: boolean;
  isEditable?: boolean;
  enterKeyHint: string;
  borderColor?: string;
  chevronColor?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  disabled?: boolean;
  isChevronShown: boolean;
  isRight?: boolean;
  listHeight?: number;
  CustomDropdownButton?: React.ComponentType<any>;
} & BorderInputProps;

const DropdownView = forwardRef<HTMLInputElement, DropdownViewProps>(
  (
    {
      scrollRef,
      onScrollList,
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
      chevronColor,
      width,
      height = 40,
      backgroundColor,
      disabled,
      isChevronShown,
      fontSize,
      fontWeight,
      isRight,
      listHeight,
      CustomDropdownButton,
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

    const props = {
      onClickDropdown,
      ref,
      isCustomMode,
      customValue,
      displayValue,
      onChangeInput,
      onFocusInput,
      isOpened,
      isChevronShown,
      isEditable,
      enterKeyHint,
      borderColor,
      backgroundColor,
      chevronColor,
      height,
      width,
      fontSize,
      fontWeight,
      isRight,
      onKeyDownHandler,
      disabled,
      listHeight,
      ...inputProps,
    };

    return (
      <DropdownContainer
        $isOpened={isOpened}
        $isTransitionDone={isTransitionDone}
        width={width}
      >
        {CustomDropdownButton ? (
          <CustomDropdownButton {...props} />
        ) : (
          <DefaultDropdownButton {...props} />
        )}

        {!disabled && (
          <DropdownList
            ref={scrollRef}
            onScroll={onScrollList}
            $height={height}
            $isOpened={isOpened}
            $reverseDirection={reverseDirection}
            $listHeight={listHeight}
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
