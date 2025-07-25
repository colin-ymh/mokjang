'use client';

import React, { ChangeEvent, forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';

import { WHITE } from '@/constants/styles/color';
import BorderInput from '@/components/atoms/common/input/border-input';
import { InputProps } from '@/components/atoms/common/input/main-input';
import StatusDropdownItem, {
  StatusDropdownValueType,
} from '@/components/atoms/common/dropdown/status-dropdown-item';
import SvgIcon from '@/components/atoms/common/icon/svg-icon';
import { getStatusBackgroundColor, getStatusFontColor } from '@/utils/color';
import { Chevron } from '@/components/atoms/common/dropdown/dropdown-chevron';

const DropdownContainer = styled.div<{
  $isOpened: boolean;
  $isTransitionDone: boolean;
  width?: number;
}>`
  position: relative;
  z-index: ${({ $isTransitionDone }) => ($isTransitionDone ? 100 : 'auto')};
  width: ${({ width }) => (width ? `${width}px` : `100%`)};
`;

const DropdownButton = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  cursor: pointer;
  justify-content: center;
  position: relative;
`;

const ColoredDot = styled.div<{ color?: string }>`
  display: ${({ color }) => (color ? 'flex' : 'none')};
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: ${({ color }) => color};
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
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

type DropdownViewProps = {
  items: StatusDropdownValueType[];
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
} & InputProps;

const StatusDropdownView = forwardRef<HTMLInputElement, DropdownViewProps>(
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

    const icon = items.find((item) => item.value === innerValue)?.icon;

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
            backgroundColor={getStatusBackgroundColor(innerValue)}
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
            color={getStatusFontColor(innerValue)}
            icon={
              icon && (
                <SvgIcon
                  svg={icon}
                  color={getStatusFontColor(innerValue)}
                  size={14}
                />
              )
            }
            {...inputProps}
          />
          <Chevron
            $isOpened={isOpened}
            color={getStatusFontColor(innerValue)}
          />
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
              <StatusDropdownItem
                key={index}
                item={item}
                onClick={onClickItem}
                isSelected={item.value === innerValue}
                isFocused={focusedIndex === index}
              />
            ))}
          </DropdownList>
        )}
      </DropdownContainer>
    );
  }
);

export default StatusDropdownView;
