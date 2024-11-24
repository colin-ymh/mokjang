"use client";

import React, {
  InputHTMLAttributes,
  MutableRefObject,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";

import { BLACK, GRAY, MAIN } from "@/common/styles/color";

const BorderInputContainer = styled.input<{ value: any }>`
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  padding: 12px 16px;
  border: ${({ value }: { value: string }) =>
    value ? `1px solid ${BLACK}` : `1px solid ${GRAY.DEFAULT}`};
  border-radius: 8px;
  color: ${BLACK};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border: 1px solid ${MAIN.DEFAULT};
  }
`;

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  ref?: MutableRefObject<any>;
};

const BorderInput = ({ ref, ...props }: InputProps) => {
  // hydration failed because the server rendered html didn't match the client 에러로 인한 csr
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // 클라이언트 렌더링 확인
  }, []);

  if (!isMounted) return null; // 서버에서는 렌더링하지 않음

  // -------------------------------------------------------------------------

  return <BorderInputContainer ref={ref} value={props.value} {...props} />;
};

export default BorderInput;
