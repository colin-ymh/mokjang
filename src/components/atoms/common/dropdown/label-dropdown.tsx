"use client";

import React from "react";
import styled from "styled-components";

import { MainText } from "@/components/atoms/common/text/main-text";
import Dropdown, {
  DropdownProps,
} from "@/components/atoms/common/dropdown/dropdown";
import { InputProps } from "@/components/atoms/common/input/border-input";

const LabelDropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

type LabelDropdownProps = DropdownProps & {
  label: string;
};

const LabelDropdown = ({
  label,
  value,
  onChangeItem,
  items,
  ...inputProps
}: LabelDropdownProps & InputProps) => {
  return (
    <LabelDropdownContainer>
      <MainText>{label}</MainText>
      <Dropdown
        value={value}
        items={items}
        onChangeItem={onChangeItem}
        {...inputProps}
      />
    </LabelDropdownContainer>
  );
};

export default LabelDropdown;
