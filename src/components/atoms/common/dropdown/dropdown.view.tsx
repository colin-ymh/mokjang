"use client";

import React, { ChangeEvent, forwardRef } from "react";
import styled from "styled-components";

import { WHITE } from "@/constants/styles/color";
import DropdownItem, {
  DropdownValueType,
} from "@/components/atoms/common/dropdown/dropdown-item";
import BorderInput from "@/components/atoms/common/input/border-input";
import { InputProps } from "@/components/atoms/common/input/main-input";

const DropdownContainer = styled.div<{ $isOpened: boolean; width?: number }>`
  position: relative;
  z-index: ${({ $isOpened }) => ($isOpened ? 50 : null)};
  width: ${({ width }) => (width ? `${width}px` : `100%`)};
`;

const DropdownButton = styled.div`
  display: flex;
  width: 100%;
  flex-direction: "row";
`;

const DropdownList = styled.div<{
  $reverseDirection?: boolean;
}>`
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
  align-items: center;
  overflow: scroll;
  max-height: 200px;
  max-width: 300px;
  bottom: ${({ $reverseDirection }) => ($reverseDirection ? "55px" : null)};
`;

type DropdownViewProps = {
  items: DropdownValueType[];
  innerValue: any;
  isOpened: boolean;
  onClickDropdown: () => void;
  onClickItem: (value: any) => void;
  onChangeInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onPressEnter: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocusInput: () => void;
  reverseDirection?: boolean;
  isEditable?: boolean;
  enterKeyHint: string;
  borderColor?: string;
  width?: number;
  height?: number;
  isContainerHidden?: boolean;
};

const DropdownView = forwardRef<
  HTMLInputElement,
  DropdownViewProps & InputProps
>(
  (
    {
      //
      items,
      innerValue,
      //
      isOpened,
      onClickDropdown, // 드롭다운 열고 닫기
      onClickItem, // 드롭다운 아이템 선택
      onChangeInput, // input 창에 직접 수정
      onPressEnter,
      onFocusInput,
      enterKeyHint,
      //
      reverseDirection,
      isEditable,
      borderColor,
      height,
      width,
      isContainerHidden,
      ...inputProps
    },
    ref,
  ) => {
    return (
      <DropdownContainer $isOpened={isOpened} width={width}>
        {/* 실제 드롭다운의 값이 보이는 공간*/}
        <DropdownButton onClick={onClickDropdown}>
          {/* 실제 값을 input 창으로 관리*/}
          {/* 수정을 원하는 경우, 바로 입력이 가능하도록 */}
          <BorderInput
            ref={ref}
            value={
              // 사용자가 드롭다운 아이템을 선택한 경우 => items 에서 해당 값을 찾아서 title을 보여줌
              // 사용자가 직접 입력한 경우 => items에 해당 값이 없음 => 입력한 값을 그대로 보여줌
              items.find((item) => item.value === innerValue)?.title ||
              innerValue
            }
            onChange={onChangeInput}
            borderColor={borderColor}
            height={height}
            width={width}
            {...inputProps}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              inputProps.onKeyDown?.(event);
              onPressEnter(event);
            }}
            readOnly={!isEditable}
            onFocus={onFocusInput}
            enterKeyHint={enterKeyHint}
          />
        </DropdownButton>

        {/* 드롭다운 item 을 선택할 수 있는 영역*/}
        {isOpened && (
          <DropdownList $reverseDirection={reverseDirection}>
            {items.map((item, index) => (
              <DropdownItem
                key={index}
                isSelected={item.value === innerValue}
                item={item}
                onClick={onClickItem}
              />
            ))}
          </DropdownList>
        )}
      </DropdownContainer>
    );
  },
);

export default DropdownView;
