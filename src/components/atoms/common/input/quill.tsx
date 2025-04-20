import React, { forwardRef } from 'react';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { GRAY, WHITE } from '@/constants/styles/color';

/* ───────── 스타일 ───────── */
const StyledQuill = styled(ReactQuill)<{
  $isEditable: boolean;
  $minHeight?: number;
}>`
  /* 전체를 세로 flex 박스로 */
  display: flex;
  flex-direction: column;

  transition: min-height 0.3s ease;
  /* 원하는 전체 높이 (toolbar + editor) */
  min-height: ${({ $minHeight, $isEditable }) =>
    $minHeight
      ? $isEditable
        ? `${$minHeight}px`
        : ` ${$minHeight - 40}px`
      : 'auto'};

  /* 툴바는 고정 크기 */
  .ql-toolbar {
    transition:
      height 0.3s ease,
      padding 0.3s ease,
      border 0.1ms ease-out;

    height: ${({ $isEditable }) => ($isEditable ? '40px' : '0')};
    padding: ${({ $isEditable }) => ($isEditable ? '8px' : '0')};
    border: ${({ $isEditable }) =>
      `1px solid ${$isEditable ? GRAY.DEFAULT : 'transparent'}`};
    border-bottom: ${({ $isEditable }) =>
      $isEditable ? `1px solid ${GRAY.DEFAULT}` : `0 solid ${WHITE}`};
    border-radius: 5px 5px 0 0;
    overflow: hidden;
  }

  /* 에디터 컨테이너: 남은 공간을 다 채우고 내부 스크롤 */
  .ql-container {
    flex: 1 1 auto;
    overflow: visible !important;
    border: 1px solid ${GRAY.DEFAULT};
    background: ${WHITE};
    ${({ $isEditable }) =>
      $isEditable
        ? 'border-top: none; border-radius: 0 0 5px 5px;'
        : 'border-radius: 5px;'}
  }

  /* 실제 편집 영역 여유 패딩 */
  .ql-editor {
    padding: 10px;
    min-height: 0;
    font-size: 14px;
  }

  .ql-editor.ql-blank::before {
    font-style: normal !important;
    left: 10px;
  }

  /* 툴바 숨김 상태에서도 위쪽 border 유지 */
  ${({ $isEditable }) =>
    !$isEditable &&
    `
    .ql-toolbar + .ql-container {
      border-top: 1px solid ${GRAY.DEFAULT} !important;
    }
  `}
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
const Quill = forwardRef<QuillHandle, QuillProps>(
  (
    {
      value,
      placeholder,
      onChange,
      onFocus,
      onBlur,
      isEditable = true,
      minHeight,
    },
    ref
  ) => {
    return (
      <StyledQuill
        ref={ref}
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
  }
);
Quill.displayName = 'Quill';
export default Quill;
