"use client";

import React from "react";
import styled from "styled-components";

import { MainText } from "@/common/components/text/main-text";
import BorderInput, {
  BorderInputProps,
} from "@/common/components/input/border-input";

import { DEFAULT_VALUE } from "@/common/default/default-value";
import { SCOPED } from "@/constant/locales/scoped/placeholder";

import { useScopedI18n } from "../../../locales/client";

const LabelInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

type LabelInputProps = BorderInputProps & {
  label: string;
};

const LabelInput = ({
  label,
  value,
  onChange,
  placeholder,
}: LabelInputProps) => {
  const PLACEHOLDER = useScopedI18n(SCOPED.PLACEHOLDER);

  return (
    <LabelInputContainer>
      <MainText>{label}</MainText>
      <BorderInput
        value={value}
        onChange={onChange || DEFAULT_VALUE.FUNCTION}
        placeholder={placeholder}
      />
    </LabelInputContainer>
  );
};

export default LabelInput;
