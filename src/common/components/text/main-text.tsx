import styled from "styled-components";

export type MainTextProps = {
  size?: "small" | "medium" | "large";
  color?: string;
  type?: "title" | "content";
  fontWeight?: number;
};

const getFontSize = (
  size: "small" | "medium" | "large" | undefined,
  type: "title" | "content" | undefined,
) => {
  let baseSize: number;

  switch (size) {
    case "small":
      baseSize = 12;
      break;
    case "large":
      baseSize = 18;
      break;
    case "medium":
    default:
      baseSize = 15;
      break;
  }

  // title인 경우 +3px
  if (type === "title") {
    return `${baseSize + 3}px`;
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
  margin: 0px 0px;
  font-size: ${({ size, type }) => getFontSize(size, type)};
  color: ${({ color }) => color || "black"};
  font-weight: ${({ size, fontWeight }) => getFontWeight(size, fontWeight)};
`;
