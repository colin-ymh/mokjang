import React from 'react';
import styled from 'styled-components';
import ChevronLeft from '../../../../../public/svg/chevron-down.svg';
import { MAIN } from '@/constants/styles/color';
import { BorderInputProps } from '@/components/atoms/common/input/border-input';
import { DropdownButtonProps } from '@/components/atoms/common/dropdown/default-dropdown-button';
import { MainText } from '@/components/atoms/common/text/main-text';

const DropdownButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  background-color: ${MAIN.EXTRA_LIGHT};
  border-radius: 1000px;
  padding: 5px 13px;
`;

const Chevron = styled(ChevronLeft)<{ $isOpened: boolean }>`
  width: 10px;
  height: 15px;
  stroke: ${MAIN.DEFAULT};
  stroke-width: 3px;
  transform: rotate(${({ $isOpened }) => ($isOpened ? '180deg' : '360deg')});
  transition: transform 0.2s ease;
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
  ...inputProps
}: DropdownButtonProps & BorderInputProps) => {
  return (
    <DropdownButton
      onClick={(event) => {
        event.stopPropagation();
        onClickDropdown(event);
      }}
      value={displayValue}
      {...inputProps}
    >
      <MainText color={MAIN.DEFAULT}>{displayValue}</MainText>
      {isChevronShown && <Chevron $isOpened={isOpened} />}
    </DropdownButton>
  );
};

export default TagDropdownButton;
