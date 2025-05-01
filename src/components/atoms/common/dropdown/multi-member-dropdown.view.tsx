'use client';

import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { BLACK, GRAY, MAIN, WHITE } from '@/constants/styles/color';
import MultiMemberDropdownItem from '@/components/atoms/common/dropdown/multi-member-dropdown-item';
import ChevronLeft from '../../../../../public/svg/chevron-down.svg';
import MainInput from '@/components/atoms/common/input/main-input';
import { MainText } from '@/components/atoms/common/text/main-text';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';

/* --------------------------- styled --------------------------- */
const Wrapper = styled.div<{ $isOpened: boolean; width?: number }>`
  position: relative;
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  z-index: ${({ $isOpened }) => ($isOpened ? 30 : 'auto')};
`;

const ButtonArea = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  cursor: pointer;
`;

const InputContainer = styled.div<{
  $borderColor?: string;
  $backgroundColor?: string;
  height?: number;
  width?: number;
  $disabled?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  border: 1px solid ${({ $borderColor }) => $borderColor ?? GRAY.DEFAULT};
  border-radius: 5px;
  background-color: ${({ $disabled, $backgroundColor }) =>
    $disabled ? GRAY.SEMI_LIGHT : ($backgroundColor ?? WHITE)};
  transition: border 0.3s ease;
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
  overflow: hidden;

  &:focus-within {
    border-color: ${MAIN.DEFAULT};
  }
`;

const TagContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
  gap: 5px;
`;

const Tag = styled.button<{ $isEditable: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${({ $isEditable }) =>
    $isEditable ? GRAY.SEMI_LIGHT : 'transparent'};
  border: none;
  border-radius: 4px;
  padding: 5px;
  font-size: 12px;
  cursor: ${({ $isEditable }) => ($isEditable ? 'pointer' : 'default')};
`;

const Close = styled.span`
  font-size: 12px;
  line-height: 1;
`;

const Chevron = styled(ChevronLeft)<{ $isOpened: boolean; $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'block' : 'none')};
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
  bottom: ${({ $reverse }) => ($reverse ? '55px' : 'auto')};
`;

/* --------------------------- component --------------------------- */
export type MultiMemberDropdownViewProps = {
  items: MemberDropdownType[];
  values: MemberDropdownType[];
  searchText: string;
  isOpened: boolean;
  setIsOpened: (b: boolean) => void;
  focusedIndex: number;
  isEditable: boolean;
  reverseDirection?: boolean;
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
} & React.InputHTMLAttributes<HTMLInputElement>;

const MultiMemberDropdownView = forwardRef<
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
      reverseDirection,
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
      ...rest
    },
    ref
  ) => (
    <Wrapper $isOpened={isOpened} width={width}>
      {/* 입력 영역 (Tag + 검색 input) */}
      <ButtonArea
        onClick={() => {
          if (disabled) return;
          if (items.length > 0) {
            setIsOpened(true);
          } else {
            setIsOpened(false);
          }
        }}
      >
        <InputContainer
          $borderColor={borderColor}
          $backgroundColor={backgroundColor}
          height={height}
          width={width}
          $disabled={disabled}
        >
          <TagContainer $isShown={values.length > 0}>
            {values.map((v) => (
              <Tag
                key={v.value}
                $isEditable={isEditable}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEditable) removeValue(v);
                }}
              >
                <MainText>{v.title}</MainText>
                {isEditable && <Close>&times;</Close>}
              </Tag>
            ))}
          </TagContainer>
          <MainInput
            ref={ref}
            value={searchText}
            onChange={onChangeInput}
            onKeyDown={onKeyDownHandler}
            placeholder={placeholder}
            enterKeyHint={enterKeyHint}
            disabled={disabled}
            backgroundColor={'transparent'}
            borderBottomColor={'transparent'}
            {...rest}
          />
        </InputContainer>

        <Chevron $isOpened={isOpened} $isShown={isEditable} />
      </ButtonArea>

      {/* 옵션 리스트 */}
      <List $open={items.length > 0 && isOpened} $reverse={reverseDirection}>
        {items.map((item, idx) => (
          <MultiMemberDropdownItem
            key={item.value}
            item={item}
            onClick={addValue}
            isFocused={focusedIndex === idx}
            isSelected={values.includes(item)}
          />
        ))}
      </List>
    </Wrapper>
  )
);

MultiMemberDropdownView.displayName = 'MultiMemberDropdownView';
export default MultiMemberDropdownView;
