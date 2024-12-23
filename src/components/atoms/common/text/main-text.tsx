import styled from "styled-components";
import { BLACK } from "@/constants/styles/color";

export type MainTextProps = {
  size?: "small" | "medium" | "large";
  color?: string;
  fontSize?: number;
  fontWeight?: number;
};

const getFontSize = (
  size: "small" | "medium" | "large" | undefined,
  fontSize?: number,
) => {
  if (fontSize) {
    return `${fontSize}px`; // fontWeight 가 설정된 경우 그대로 사용
  }

  let baseSize: number;

  switch (size) {
    case "small":
      baseSize = 12;
      break;
    case "large":
      baseSize = 16;
      break;
    case "medium":
    default:
      baseSize = 14;
      break;
  }

  return `${baseSize}px`;
};

// size에 따라 font-weight를 조정
const getFontWeight = (
  size: "small" | "medium" | "large" | undefined,
  fontWeight?: number,
) => {
  if (fontWeight) {
    return fontWeight; // fontWeight가 설정된 경우 그대로 사용
  }

  // size에 따른 기본 font-weight 값 설정
  switch (size) {
    case "small":
      return 400;
    case "large":
      return 600;
    case "medium":
    default:
      return 400;
  }
};

export const MainText = styled.p<MainTextProps>`
  margin: 0;
  font-size: ${({ size, fontSize }) => getFontSize(size, fontSize)};
  color: ${({ color }) => color || BLACK};
  font-weight: ${({ size, fontWeight }) => getFontWeight(size, fontWeight)};
  transition: all 0.3s ease;

  white-space: nowrap; /* 텍스트를 한 줄로 유지 */
  max-width: 100%; /* 버튼 크기를 벗어나지 않도록 제한 */
`;
