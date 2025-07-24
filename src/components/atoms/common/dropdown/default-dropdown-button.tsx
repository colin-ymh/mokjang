import React, { forwardRef } from 'react';
import styled from 'styled-components';
import ChevronLeft from '../../../../../public/svg/chevron-down.svg';
import { BLACK } from '@/constants/styles/color';
import BorderInput, {
  BorderInputProps,
} from '@/components/atoms/common/input/border-input';

const DropdownButton = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  cursor: pointer;
  position: relative;
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

export type DropdownButtonProps = {
  onClickDropdown: (event: React.MouseEvent<HTMLDivElement>) => void;
  isCustomMode: boolean;
  customValue?: string;
  displayValue?: string;
  onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocusInput: () => void;
  isOpened: boolean;
  isChevronShown: boolean;
  isEditable?: boolean;
  enterKeyHint: string;
  borderColor?: string;
  backgroundColor?: string;
  height?: number;
  width?: number;
  fontSize?: number;
  fontWeight?: number;
  isRight?: boolean;
  disabled?: boolean;
  onKeyDownHandler: (event: React.KeyboardEvent<HTMLInputElement>) => void;
} & BorderInputProps;

const DefaultDropdownButton = forwardRef<HTMLInputElement, DropdownButtonProps>(
  (
    {
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
    },
    ref
  ) => {
    return (
      <DropdownButton
        onClick={(event) => {
          event.stopPropagation();
          onClickDropdown(event);
        }}
      >
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
    );
  }
);

DefaultDropdownButton.displayName = 'DefaultDropdownButton';

export default DefaultDropdownButton;
