import styled from 'styled-components';
import { BLACK } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';

export type MainTextProps = {
  size?: SIZE;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
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
      return `${20}px`;
    case SIZE.MEDIUM:
    default:
      return `${14}px`;
  }
};

// size에 따라 font-weight를 조정
const getFontWeight = (size?: SIZE, fontWeight?: number) => {
  if (fontWeight) {
    return fontWeight; // fontWeight가 설정된 경우 그대로 사용
  }

  // size에 따른 기본 font-weight 값 설정
  switch (size) {
    case SIZE.EXTRA_SMALL:
      return 100;
    case SIZE.SMALL:
      return 300;
    case SIZE.LARGE:
      return 700;
    case SIZE.EXTRA_LARGE:
      return 900;
    case SIZE.MEDIUM:
    default:
      return 500;
  }
};

export const MainText = styled.span<MainTextProps>`
  margin: 0;
  font-size: ${({ size, fontSize }) => getFontSize(size, fontSize)};
  color: ${({ color }) => color || BLACK};
  font-weight: ${({ size, fontWeight }) => getFontWeight(size, fontWeight)};
  transition: all 0.3s ease;

  white-space: nowrap; /* 텍스트를 한 줄로 유지 */
  max-width: 100%; /* 버튼 크기를 벗어나지 않도록 제한 */
  font-family: 'Noto Sans KR', sans-serif; /* Noto Sans KR 적용 */
`;
