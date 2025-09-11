import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { BorderInput, BorderInputProps } from '@mokjang/components';
import { Chevron } from './dropdown-chevron';
import { MAIN } from '@mokjang/constants';

const DropdownButton = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  cursor: pointer;
  position: relative;
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
  chevronColor?: string;
  height?: number;
  width?: number;
  fontSize?: number;
  fontWeight?: number;
  isRight?: boolean;
  disabled?: boolean;
  onKeyDownHandler: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  color?: string;
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
      chevronColor,
      height,
      width,
      fontSize,
      fontWeight,
      isRight,
      onKeyDownHandler,
      disabled,
      color,
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
          borderColor={isOpened ? MAIN.DEFAULT : borderColor}
          backgroundColor={backgroundColor}
          height={height}
          width={width}
          readOnly={!isEditable}
          enterKeyHint={enterKeyHint}
          disabled={disabled}
          color={color}
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
        {isChevronShown && (
          <Chevron $isOpened={isOpened} color={chevronColor || color} />
        )}
      </DropdownButton>
    );
  }
);

DefaultDropdownButton.displayName = 'DefaultDropdownButton';

export default DefaultDropdownButton;
