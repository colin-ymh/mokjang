import React from 'react';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { GRAY, WHITE } from '@/constants/styles/color';

/* ───────── 스타일 ───────── */
const StyledQuill = styled(ReactQuill)<{
  $isEditable: boolean;
  $minHeight?: number;
}>`
  /* 전체를 세로 flex 박스로 */
  border: 1px solid ${GRAY.DEFAULT};
  border-radius: 5px;
  overflow: hidden;

  display: flex;
  flex-direction: column-reverse;

  transition: min-height 0.3s ease;
  /* 원하는 전체 높이 (toolbar + editor) */
  min-height: ${({ $minHeight, $isEditable }) =>
    $minHeight
      ? $isEditable
        ? `${$minHeight}px`
        : ` ${$minHeight - 40}px`
      : 'auto'};

  /* 툴바: 위쪽 border만 남기기 */
  .ql-toolbar {
    border: none;
    border-top: ${({ $isEditable }) =>
      $isEditable ? ` 1px solid ${GRAY.DEFAULT}` : `0 solid ${WHITE}`};
    border-radius: 0 0 5px 5px;
    height: ${({ $isEditable }) => ($isEditable ? '40px' : '0')};
    padding: ${({ $isEditable }) => ($isEditable ? '8px' : '0')};
    //overflow: hidden;
    transition:
      height 0.3s,
      padding 0.3s;
  }

  /* 에디터 컨테이너: 내부 border 없애기 */
  .ql-container {
    border: none;
    flex: 1 1 auto;
    overflow: auto !important;
    background: ${WHITE};
  }

  /* 에디터 내부 패딩 */
  .ql-editor {
    padding: 10px;
    font-size: 14px;
  }

  .ql-editor.ql-blank::before {
    font-style: normal !important;
    left: 10px;
  }
`;

/* ───────── 타입 ───────── */
export type QuillHandle = ReactQuill | null; // 부모에서 ref 유형

type QuillProps = {
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isEditable?: boolean;
  minHeight?: number;
};

/* ───────── 컴포넌트 ───────── */
const Quill = ({
  value,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  isEditable = true,
  minHeight,
}: QuillProps) => {
  return (
    <StyledQuill
      theme="snow"
      value={value}
      onChange={onChange}
      $minHeight={minHeight}
      // readOnly={!isEditable}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      modules={{
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
        ],
      }}
      $isEditable={isEditable}
    />
  );
};
Quill.displayName = 'Quill';
export default Quill;
