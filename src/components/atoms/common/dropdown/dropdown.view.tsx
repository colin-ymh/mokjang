'use client';

import React, { ChangeEvent, forwardRef } from 'react';
import styled from 'styled-components';

import { WHITE } from '@/constants/styles/color';
import DropdownItem, {
  DropdownValueType,
} from '@/components/atoms/common/dropdown/dropdown-item';
import BorderInput from '@/components/atoms/common/input/border-input';
import { InputProps } from '@/components/atoms/common/input/main-input';

const DropdownContainer = styled.div<{ $isOpened: boolean; width?: number }>`
  position: relative;
  z-index: ${({ $isOpened }) => ($isOpened ? 50 : 'auto')};
  width: ${({ width }) => (width ? `${width}px` : `100%`)};
`;

const DropdownButton = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  cursor: pointer;
`;

const DropdownList = styled.div<{ $reverseDirection?: boolean }>`
  position: absolute;
  margin-top: 10px;
  border-radius: 5px;
  background-color: ${WHITE};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: auto;
  max-height: 200px;
  bottom: ${({ $reverseDirection }) => ($reverseDirection ? '55px' : 'auto')};
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
} & InputProps;

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
      ...inputProps
    },
    ref
  ) => {
    // 현재 표시할 텍스트 (드롭다운 아이템 중 매칭되는 title, 없으면 그냥 innerValue)
    const displayValue =
      items.find((item) => item.value === innerValue)?.title || innerValue;

    return (
      <DropdownContainer $isOpened={isOpened} width={width}>
        {/* 드롭다운 버튼(실제로는 BorderInput이 들어감) */}
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
            readOnly={!isEditable} // 커스텀 모드일 땐 isEditable=true
            enterKeyHint={enterKeyHint}
            disabled={disabled}
            onKeyDown={(event) => {
              inputProps.onKeyDown?.(event);
              if (isOpened) {
                onKeyDownHandler(event);
              }
            }}
            {...inputProps}
          />
        </DropdownButton>

        {/* 드롭다운 메뉴 목록 */}
        {isOpened && !disabled && (
          <DropdownList $reverseDirection={reverseDirection}>
            {items.map((item, index) => (
              <DropdownItem
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

DropdownView.displayName = 'DropdownView';
export default DropdownView;
