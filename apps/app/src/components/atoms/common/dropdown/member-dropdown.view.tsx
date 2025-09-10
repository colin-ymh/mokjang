'use client';

import React, { forwardRef, useState } from 'react';
import styled from 'styled-components';
import { WHITE } from '@mokjang/constants';
import MemberDropdownItem, { MemberDropdownType } from './member-dropdown-item';
import { BorderInput, TransparentBackground } from '@mokjang/components';
import useWindowSize from '@/hooks/window/window';

/* --------------------------- styled --------------------------- */
const Wrapper = styled.div<{ $isOpened: boolean; width?: number }>`
  position: relative;
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  z-index: ${({ $isOpened }) => ($isOpened ? 100 : 'auto')};
`;

const DropdownButton = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  cursor: pointer;
  position: relative;
`;

const List = styled.div<{ $open: boolean; $reverse?: boolean }>`
  position: absolute;
  margin-top: 8px;
  width: 100%;
  border-radius: 5px;
  background: ${WHITE};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  flex-direction: column;
  overflow-y: auto;
  max-height: 200px;
  bottom: ${({ $reverse }) => ($reverse ? '50px' : 'auto')};
  top: ${({ $reverse }) => ($reverse ? 'auto' : '40px')};
  z-index: 400;
`;

/* --------------------------- components --------------------------- */
export type MultiMemberDropdownViewProps = {
  items: MemberDropdownType[];
  values: MemberDropdownType[];
  searchText: string;
  isOpened: boolean;
  setIsOpened: (b: boolean) => void;
  focusedIndex: number;
  isEditable: boolean;
  enterKeyHint?: string;
  placeholder?: string;
  borderColor?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  disabled?: boolean;
  addValue: (v: MemberDropdownType) => void;
  removeValue: (v: MemberDropdownType) => void;
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDownHandler: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  backgroundBlur: boolean;
  onClickBackground: () => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const MemberDropdownView = forwardRef<
  HTMLInputElement,
  MultiMemberDropdownViewProps
>(
  (
    {
      items,
      values,
      searchText,
      isOpened,
      setIsOpened,
      focusedIndex,
      isEditable,
      enterKeyHint = 'enter',
      placeholder,
      borderColor,
      width,
      height,
      backgroundColor,
      disabled,
      addValue,
      removeValue,
      onChangeInput,
      onKeyDownHandler,
      backgroundBlur,
      onClickBackground,
      ...rest
    },
    ref
  ) => {
    const windowSize = useWindowSize();
    const [reverseDirection, setReverseDirection] = useState<boolean>(false);

    const onClickButton = (event: React.MouseEvent<HTMLDivElement>) => {
      setReverseDirection(windowSize.height - event.screenY < 250);
    };
    return (
      <Wrapper $isOpened={isOpened} width={width}>
        <DropdownButton onClick={onClickButton}>
          <BorderInput
            ref={ref}
            value={searchText}
            onChange={onChangeInput}
            placeholder={placeholder}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
            height={height}
            width={width}
            readOnly={!isEditable}
            enterKeyHint={enterKeyHint}
            disabled={disabled}
            onKeyDown={onKeyDownHandler}
            {...rest}
          />
          {/*<Chevron $isOpened={isOpened} />*/}
        </DropdownButton>

        <TransparentBackground
          isOpened={isOpened}
          blur={backgroundBlur}
          onClick={onClickBackground}
          zIndex={300}
        />

        {/* 옵션 리스트 */}
        <List $open={items.length > 0 && isOpened} $reverse={reverseDirection}>
          {items.map((item, idx) => (
            <MemberDropdownItem
              key={item.value}
              item={item}
              onClick={addValue}
              isFocused={focusedIndex === idx}
              isSelected={values.includes(item)}
            />
          ))}
        </List>
      </Wrapper>
    );
  }
);

MemberDropdownView.displayName = 'MemberDropdownView';
export default MemberDropdownView;
