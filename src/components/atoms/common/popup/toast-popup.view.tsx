import { forwardRef } from "react";
import styled from "styled-components";

import Cancel from "../../../../../public/svg/cancel.svg";

import {
  MainText,
  MainTextProps,
} from "@/components/atoms/common/text/main-text";
import { WHITE } from "@/constants/styles/color";

export enum TOAST_DIRECTION {
  TOP = "top",
  BOTTOM = "bottom",
}

const PopupContainer = styled.div<{
  $backgroundColor: string;
  $direction: TOAST_DIRECTION;
}>`
  display: flex;
  position: fixed;
  z-index: 100;
  justify-content: flex-start;
  padding-left: 20px;
  align-items: center;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  height: 50px;
  width: 80%;
  max-width: 400px;
  border-radius: 5px;
  opacity: 0;
  //  방향에 따라 초기값 변경
  ${({ $direction }) =>
    $direction === TOAST_DIRECTION.TOP ? "top: -50px;" : "bottom: -50px"}
`;

const CancelButton = styled(Cancel)`
  stroke: ${WHITE};
  position: absolute;
  right: 10px;
  width: 20px;
  height: 20px;
`;

type ToastPopupViewProps = MainTextProps & {
  text?: string;
  backgroundColor: string;
  isDeletable: boolean;
  direction: TOAST_DIRECTION;
  onClickDeleteButton: () => void;
};

const ToastPopupView = forwardRef<HTMLDivElement, ToastPopupViewProps>(
  (
    {
      text,
      backgroundColor,
      isDeletable,
      direction,
      onClickDeleteButton,
      //
      fontSize,
      fontWeight,
      color,
    },
    ref,
  ) => {
    return (
      <PopupContainer
        ref={ref}
        $backgroundColor={backgroundColor}
        $direction={direction}
      >
        {text && (
          <MainText fontSize={fontSize} fontWeight={fontWeight} color={color}>
            {text}
          </MainText>
        )}
        {isDeletable && (
          <CancelButton
            onClick={onClickDeleteButton}
            text={"등록이 완료되었습니다."}
          />
        )}
      </PopupContainer>
    );
  },
);

export default ToastPopupView;
