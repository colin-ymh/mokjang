"use client";

import React, { InputHTMLAttributes, MutableRefObject } from "react";
import styled from "styled-components";

import { MainText } from "@/components/atoms/common/text/main-text";
import BorderInput from "@/components/atoms/common/input/border-input";

import { DEFAULT_VALUE } from "@/common/default/default-value";

const LabelInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  transition: all 0.3s ease;
`;

type LabelInputProps = InputHTMLAttributes<HTMLInputElement> & {
  ref?: MutableRefObject<any>;
  label: string;
};

const LabelInput = ({ ref, label, ...props }: LabelInputProps) => {
  return (
    <LabelInputContainer>
      <MainText>{label}</MainText>
      <BorderInput
        ref={ref}
        onChange={props.onChange || DEFAULT_VALUE.FUNCTION}
        {...props}
      />
    </LabelInputContainer>
  );
};

export default LabelInput;
