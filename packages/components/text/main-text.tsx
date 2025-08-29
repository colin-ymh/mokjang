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
};

const getFontSize = (size?: SIZE, fontSize?: number) => {
  if (fontSize) {
    return `${fontSize}px`; // fontSize 가 설정된 경우 그대로 사용
  }

  switch (size) {
    case SIZE.EXTRA_SMALL:
      return `${10}px`;
    case SIZE.SMALL:
      return `${12}px`;
    case SIZE.LARGE:
      return `${16}px`;
    case SIZE.EXTRA_LARGE:
      return `${18}px`;
    case SIZE.MEDIUM:
    default:
      return `${14}px`;
  }
};

// size에 따라 font-weight를 조정
const getFontWeight = (size?: SIZE, fontWeight?: number) => {
  if (fontWeight) {
    return fontWeight.toString(); // fontWeight가 설정된 경우 그대로 사용
  }

  // size에 따른 기본 font-weight 값 설정
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

// styled-components v5 이상이라면 shouldForwardProp 사용
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
    ].includes(prop),
})<MainTextProps>`
  margin: 0;
  font-size: ${({ size, fontSize }) => getFontSize(size, fontSize)};
  color: ${({ color }) => color || BLACK};
  font-weight: ${({ size, fontWeight }) => getFontWeight(size, fontWeight)};
  transition: all 0.2s ease;

  white-space: ${({ whiteSpace }) => whiteSpace || 'nowrap'};
  max-width: ${({ maxWidth }) =>
    typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth || '100%'};
  overflow: ${({ overflow }) => overflow || 'visible'};
  text-overflow: ${({ textOverflow }) => textOverflow || 'clip'};
  text-decoration: ${({ textDecoration }) => textDecoration || 'none'};
  cursor: ${({ cursor }) => cursor || 'default'};
  font-family: 'Roboto', sans-serif;
  line-height: ${({ lineHeight }) =>
    typeof lineHeight === 'number'
      ? `${lineHeight}px`
      : lineHeight || 'normal'};
`;
