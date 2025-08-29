import React from 'react';
import styled from 'styled-components';
import { MAIN } from '@/constants/styles/color';
import { BorderInputProps } from '../input/border-input';
import { DropdownButtonProps } from './default-dropdown-button';
import { MainText } from '../text/main-text';
import { Chevron } from './dropdown-chevron';

const DropdownButton = styled.div<{ $backgroundColor?: string }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  background-color: ${({ $backgroundColor }) =>
    $backgroundColor || MAIN.EXTRA_LIGHT};
  border-radius: 1000px;
  padding: 5px 13px;
  padding-right: 30px;
`;

const TagDropdownButton = ({
  onClickDropdown,
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
  height,
  width,
  fontSize,
  fontWeight,
  isRight,
  onKeyDownHandler,
  disabled,
  color,
  ...inputProps
}: DropdownButtonProps & BorderInputProps) => {
  return (
    <DropdownButton
      onClick={(event) => {
        event.stopPropagation();
        onClickDropdown(event);
      }}
      value={displayValue}
      $backgroundColor={backgroundColor}
      {...inputProps}
    >
      <MainText color={color}>{displayValue}</MainText>
      {isChevronShown && (
        <Chevron $isOpened={isOpened} color={color || MAIN.DEFAULT} />
      )}
    </DropdownButton>
  );
};

export default TagDropdownButton;
