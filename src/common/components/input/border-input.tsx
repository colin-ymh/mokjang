"use client";

import React from "react";
import styled from "styled-components";

import { GRAY, MAIN } from "@/common/styles/color";

export type BorderInputProps = {
  value: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const BorderInputContainer = styled.input`
  font-size: 15px;
  width: 100%;
  border: 1px solid ${GRAY.DEFAULT};

  &:focus {
    outline: none;
    border-bottom-color: ${MAIN.DEFAULT};
  }
`;

// Parent 의 크기에 맞게 조정되는 입력창
const BorderInput = ({
  value,
  placeholder = "",
  onChange,
}: BorderInputProps) => {
  return (
    <>
      <BorderInputContainer
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

export default BorderInput;
