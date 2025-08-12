import React from 'react';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { GRAY, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';

/* ───────── 스타일 ───────── */
const StyledQuill = styled(ReactQuill)<{
  $isEditable: boolean;
  $minHeight?: number;
}>`
  /* 전체를 세로 flex 박스로 */
  border: 1px solid ${GRAY.LIGHT};
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
      $isEditable ? ` 1px solid ${GRAY.LIGHT}` : `0 solid ${WHITE}`};
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

const InputWrapper = styled.div`
  position: relative;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

const CharCounter = styled.div<{ $disabled?: boolean }>`
  position: absolute;
  right: 0;
  bottom: -18px;
  color: ${({ $disabled }) => ($disabled ? GRAY.DEFAULT : GRAY.DARK)};
  background: transparent;
  pointer-events: none;
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
  maxLength?: number;
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
  maxLength,
}: QuillProps) => {
  const [charCount, setCharCount] = React.useState(0);

  return (
    <InputWrapper>
      <StyledQuill
        theme="snow"
        value={value}
        onChange={(_content, _delta, _source, editor) => {
          // HTML 제외 순수 텍스트 길이 계산
          const textLength = editor.getText().trimEnd().length;
          setCharCount(textLength);

          onChange(_content);
        }}
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
      {typeof maxLength === 'number' && (
        <CharCounter>
          <MainText color={GRAY.DEFAULT} size={SIZE.SMALL}>
            {charCount}/{maxLength}
          </MainText>
        </CharCounter>
      )}
    </InputWrapper>
  );
};
Quill.displayName = 'Quill';
export default Quill;
