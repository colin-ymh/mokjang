import styled from 'styled-components';
import { BLACK, SIZE } from '@mokjang/constants';

export type MainTextProps = {
  size?: SIZE;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  whiteSpace?: string;
  maxWidth?: number | string;
  overflow?: string;
  textOverflow?: string;
  textDecoration?: string;
  cursor?: string;
  lineHeight?: number | string;
  baselineOffsetPx?: number;
  ellipsis?: boolean; // ✅ 추가: 한 줄 말줄임 처리 여부
};

const getFontSize = (size?: SIZE, fontSize?: number) => {
  if (fontSize) return `${fontSize}px`;

  switch (size) {
    case SIZE.EXTRA_SMALL:
      return '10px';
    case SIZE.SMALL:
      return '12px';
    case SIZE.LARGE:
      return '16px';
    case SIZE.EXTRA_LARGE:
      return '18px';
    case SIZE.MEDIUM:
    default:
      return '14px';
  }
};

const getFontWeight = (size?: SIZE, fontWeight?: number) => {
  if (fontWeight) return fontWeight.toString();

  switch (size) {
    case SIZE.EXTRA_SMALL:
      return '300';
    case SIZE.SMALL:
      return '400';
    case SIZE.LARGE:
      return '500';
    case SIZE.EXTRA_LARGE:
      return '700';
    case SIZE.MEDIUM:
    default:
      return '400';
  }
};

export const MainText = styled.span.withConfig({
  shouldForwardProp: (prop) =>
    ![
      'size',
      'color',
      'fontSize',
      'fontWeight',
      'whiteSpace',
      'maxWidth',
      'overflow',
      'textOverflow',
      'textDecoration',
      'cursor',
      'lineHeight',
      'baselineOffsetPx',
      'ellipsis', // ✅ 추가
    ].includes(prop),
})<MainTextProps>`
  margin: 0;
  font-size: ${({ size, fontSize }) => getFontSize(size, fontSize)};
  color: ${({ color }) => color || BLACK};
  font-weight: ${({ size, fontWeight }) => getFontWeight(size, fontWeight)};
  transition: all 0.2s ease;
  transform: ${({ baselineOffsetPx = 0 }) =>
    baselineOffsetPx ? `translateY(${baselineOffsetPx}px)` : 'none'};
  font-family: 'Pretendard', sans-serif;
  line-height: ${({ lineHeight }) =>
    typeof lineHeight === 'number'
      ? `${lineHeight}px`
      : lineHeight || 'normal'};

  /* ✅ 기본 설정 */
  white-space: ${({ whiteSpace, ellipsis }) =>
    ellipsis ? 'nowrap' : whiteSpace || 'nowrap'};
  max-width: ${({ maxWidth }) =>
    typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth || '100%'};
  overflow: ${({ overflow, ellipsis }) =>
    ellipsis ? 'hidden' : overflow || 'visible'};
  text-overflow: ${({ textOverflow, ellipsis }) =>
    ellipsis ? 'ellipsis' : textOverflow || 'clip'};
  text-decoration: ${({ textDecoration }) => textDecoration || 'none'};
  cursor: ${({ cursor }) => cursor || 'default'};
`;
