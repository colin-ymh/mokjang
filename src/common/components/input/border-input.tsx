"use client";

import React from "react";
import styled from "styled-components";

import { BLACK, GRAY, MAIN } from "@/common/styles/color";

export type BorderInputProps = {
  value: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const BorderInputContainer = styled.input`
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  padding: 12px 16px;
  border: 1px solid ${GRAY.DEFAULT};
  border-radius: 8px;
  color: ${BLACK};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border: 1px solid ${MAIN.DEFAULT};
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
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </>
  );
};

export default BorderInput;
