import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import { BLACK, BLANK, GRAY, MAIN, SIZE, WHITE } from '@mokjang/constants';
import { MainText } from '@mokjang/components';

const StyledTextarea = styled.textarea<{
  $borderColor: string;
  $minHeight?: number;
  width?: number;
  color?: string;
  $disabled?: boolean;
  $backgroundColor?: string;
  $paddingLeft?: number;
}>`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 400;
  font-family: 'Pretendard', sans-serif;
  padding: 10px;
  padding-left: ${({ $paddingLeft }) =>
    $paddingLeft !== undefined ? `${$paddingLeft}px` : '10px'};
  border: 1px solid ${({ $borderColor }) => $borderColor};
  color: ${({ color }) => color || BLACK};
  transition: border 0.3s ease;

  /* 자동 높이 + 수동 리사이즈 금지 */
  height: auto;
  min-height: ${({ $minHeight }) => ($minHeight ? `${$minHeight}px` : 'auto')};
  resize: none;
  overflow: hidden;

  background-color: ${({ $disabled, $backgroundColor }) =>
    $disabled ? GRAY.SEMI_LIGHT : $backgroundColor || WHITE};
  border-radius: 5px;

  &::placeholder {
    font-family: 'Pretendard', sans-serif;
    font-size: 14px;
    color: ${GRAY.DEFAULT};
  }
  &::-webkit-input-placeholder {
    font-family: 'Pretendard', sans-serif;
    font-size: 14px;
    color: ${GRAY.DEFAULT};
  }
  &::-moz-placeholder {
    font-family: 'Pretendard', sans-serif;
    font-size: 14px;
    color: ${GRAY.DEFAULT};
  }
  &:-ms-input-placeholder {
    font-family: 'Pretendard', sans-serif;
    font-size: 14px;
    color: ${GRAY.DEFAULT};
  }
  &:-moz-placeholder {
    font-family: 'Pretendard', sans-serif;
    font-size: 14px;
    color: ${GRAY.DEFAULT};
  }

  &:focus {
    outline: none;
    border: 1px solid ${MAIN.DEFAULT};
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

type BorderTextareaProps = {
  borderColor?: string;
  /** 초기 최소 높이(px). 이전 height prop을 대체 */
  height?: number;
  width?: number;
  backgroundColor?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
  /** 내용 변경 시 즉시 리사이즈 (기본 true) */
  autoResize?: boolean;
  /** 내용 최대 높이 제한(px). 넘치면 스크롤 대신 늘리지 않음 */
  maxAutoHeight?: number;
};

// forwardRef 를 사용하여 ref 를 전달받을 수 있도록
export const BorderTextarea = forwardRef<
  HTMLTextAreaElement,
  BorderTextareaProps
>(
  (
    {
      borderColor = GRAY.LIGHT,
      value = BLANK,
      height, // 초기 최소 높이로 사용
      width,
      disabled,
      backgroundColor = WHITE,
      onChange,
      placeholder,
      readOnly = false,
      onBlur,
      maxLength,
      autoResize = true,
      maxAutoHeight,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    // 외부 ref와 내부 ref를 병합
    const setRefs = (el: HTMLTextAreaElement | null) => {
      innerRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref && 'current' in (ref as any)) (ref as any).current = el;
    };

    const resizeToFit = () => {
      const el = innerRef.current;
      if (!el) return;
      // 높이를 자동으로 리셋 후 scrollHeight만큼 재설정
      el.style.height = 'auto';
      let next = el.scrollHeight;

      if (typeof maxAutoHeight === 'number') {
        next = Math.min(next, maxAutoHeight);
        // maxAutoHeight를 넘는 경우에는 스크롤이 생기도록 처리
        el.style.overflowY =
          el.scrollHeight > maxAutoHeight ? 'auto' : 'hidden';
      }

      el.style.height = `${next}px`;
    };

    // 마운트 및 value 변경 시 자동 리사이즈
    useLayoutEffect(() => {
      if (autoResize) resizeToFit();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, autoResize]);

    // 폰트 로딩/컨테이너 리사이즈 등 초기 틀어짐 방지
    useEffect(() => {
      if (!autoResize) return;
      const el = innerRef.current;
      if (!el) return;

      // 폰트 로딩 이벤트 대응
      if ((document as any).fonts?.ready) {
        (document as any).fonts.ready.then(resizeToFit).catch(() => {});
      }

      // 컨테이너 리사이즈 대응
      const ro = new ResizeObserver(() => resizeToFit());
      ro.observe(el);
      return () => ro.disconnect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) resizeToFit();
      onChange?.(e);
    };

    return (
      <InputWrapper>
        <StyledTextarea
          ref={setRefs}
          value={value}
          onChange={handleChange}
          readOnly={readOnly}
          $borderColor={borderColor}
          $backgroundColor={backgroundColor}
          $minHeight={height}
          width={width}
          $disabled={disabled}
          placeholder={placeholder}
          onBlur={onBlur}
          // 사용자가 수동 리사이즈 못 하게 CSS로 이미 막았지만 안전하게 prop으로도 막기
          // (일부 브라우저 호환성)
          {...props}
        />
        {typeof maxLength === 'number' && (
          <CharCounter $disabled={disabled}>
            <MainText color={GRAY.DEFAULT} size={SIZE.SMALL}>
              {value.toString().length}/{maxLength}
            </MainText>
          </CharCounter>
        )}
      </InputWrapper>
    );
  }
);
