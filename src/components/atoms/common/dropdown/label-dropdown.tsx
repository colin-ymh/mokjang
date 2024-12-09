"use client";

import React, { forwardRef } from "react";
import styled from "styled-components";

import { MainText } from "@/components/atoms/common/text/main-text";
import Dropdown, {
  DropdownProps,
} from "@/components/atoms/common/dropdown/dropdown";
import { FLEX_DIRECTION } from "@/constants/styles/style";

const LabelDropdownContainer = styled.div<{
  width?: number;
  $flexDirection: FLEX_DIRECTION;
}>`
  display: flex;
  flex-direction: ${({ $flexDirection }) => $flexDirection};
  align-items: ${({ $flexDirection }) =>
    $flexDirection === FLEX_DIRECTION.ROW ? "center" : null};
  width: auto;
  gap: 8px;
`;

type LabelDropdownProps = DropdownProps & {
  label: string;
  flexDirection?: FLEX_DIRECTION;
};

const LabelDropdown = forwardRef<HTMLInputElement, LabelDropdownProps>(
  (
    {
      label,
      value,
      onChangeItem,
      items,
      enterKeyHint,
      height,
      width,
      flexDirection = FLEX_DIRECTION.COLUMN,
      ...dropdownProps
    },
    ref,
  ) => {
    return (
      <LabelDropdownContainer $flexDirection={flexDirection}>
        <MainText>{label}</MainText>
        <Dropdown
          ref={ref}
          value={value}
          items={items}
          onChangeItem={onChangeItem}
          height={height}
          width={width}
          {...dropdownProps}
        />
      </LabelDropdownContainer>
    );
  },
);

export default LabelDropdown;
