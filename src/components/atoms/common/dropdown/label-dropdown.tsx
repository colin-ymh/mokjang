"use client";

import React, { forwardRef, RefObject } from "react";
import styled from "styled-components";

import { MainText } from "@/components/atoms/common/text/main-text";
import Dropdown, {
  DropdownProps,
} from "@/components/atoms/common/dropdown/dropdown";

const LabelDropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

type LabelDropdownProps = DropdownProps & {
  ref?: RefObject<HTMLDivElement>;
  label: string;
  placeholder?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const LabelDropdown = forwardRef<HTMLInputElement, LabelDropdownProps>(
  ({ label, value, onChangeItem, items, ...dropdownProps }, ref) => {
    return (
      <LabelDropdownContainer>
        <MainText>{label}</MainText>
        <Dropdown
          ref={ref}
          value={value}
          items={items}
          onChangeItem={onChangeItem}
          {...dropdownProps}
        />
      </LabelDropdownContainer>
    );
  },
);

LabelDropdown.displayName = "LabelDropdown"; // for debugging purposes

export default LabelDropdown;
