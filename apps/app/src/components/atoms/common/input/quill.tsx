import React from 'react';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { GRAY, SIZE, WHITE } from '@mokjang/constants';
import { MainText } from '@mokjang/components';

/* ───────── 스타일 ───────── */
const StyledQuill = styled(ReactQuill)<{
  $isEditable: boolean;
  $minHeight?: number;
}>`
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;

  transition: min-height 0.3s ease;
  min-height: ${({ $minHeight, $isEditable }) =>
    $minHeight
      ? $isEditable
        ? `${$minHeight}px`
        : `${$minHeight - 40}px`
      : 'auto'};

  .ql-toolbar {
    border: none;
    border-top: ${({ $isEditable }) =>
      $isEditable ? `1px solid ${GRAY.LIGHT}` : `0 solid ${WHITE}`};
    border-radius: 0 0 5px 5px;
    height: ${({ $isEditable }) => ($isEditable ? '40px' : '0')};
    padding: ${({ $isEditable }) => ($isEditable ? '8px' : '0')};
    transition:
      height 0.3s,
      padding 0.3s;
  }

  .ql-container {
    border: none;
    flex: 1 1 auto;
    overflow: auto !important;
    background: ${WHITE};
  }

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
export type QuillHandle = ReactQuill | null;

type OnChangeOneArg = (val: string) => void;
type OnChangeThreeArgs = (content: string, delta: any, source: any) => void;

type QuillProps = {
  value: string;
  placeholder?: string;
  // ✅ (문자열 1개) 또는 (content, delta, source) 둘 다 허용
  onChange?: OnChangeOneArg | OnChangeThreeArgs;
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

  // (선택) 초기 값 기준으로 글자수 세팅
  React.useEffect(() => {
    const div = document.createElement('div');
    div.innerHTML = value ?? '';
    const textLength = (div.textContent || '').trimEnd().length;
    setCharCount(textLength);
  }, [value]);

  const handleChange = (
    _content: string,
    _delta: any,
    _source: any,
    editor: any
  ) => {
    // HTML 제외 순수 텍스트 길이 계산
    const textLength = editor.getText().trimEnd().length;
    setCharCount(textLength);

    if (!onChange) return;

    // ✅ onChange에 정의된 파라미터 개수로 분기
    if (onChange.length >= 3) {
      (onChange as OnChangeThreeArgs)(_content, _delta, _source);
    } else {
      (onChange as OnChangeOneArg)(_content);
    }
  };

  return (
    <InputWrapper>
      <StyledQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        $minHeight={minHeight}
        readOnly={!isEditable}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        modules={{
          toolbar: isEditable
            ? [
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link'],
              ]
            : false, // 편집 불가 시 툴바 off
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
