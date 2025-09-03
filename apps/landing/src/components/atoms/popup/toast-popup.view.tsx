import { forwardRef } from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { MainText, MainTextProps } from '@mokjang/components';
import { WHITE } from '@mokjang/constants';

import { Svg } from '@mokjang/assets';

export enum TOAST_DIRECTION {
  TOP = 'top',
  BOTTOM = 'bottom',
}

const PopupContainer = styled.div<{
  $backgroundColor: string;
  $direction: TOAST_DIRECTION;
}>`
  display: flex;
  position: fixed;
  z-index: 9999;
  justify-content: flex-start;
  align-items: center;
  padding-left: 20px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  height: 50px;
  width: 50%;
  max-width: 400px;
  border-radius: 5px;
  opacity: 0;

  left: 50%;
  transform: translateX(-50%);

  // 방향에 따라 초기 위치 설정
  ${({ $direction }) =>
    $direction === TOAST_DIRECTION.TOP ? 'top: -50px;' : 'bottom: -50px;'}
`;

const CancelButton = styled(Svg.Cancel)`
  stroke: ${WHITE};
  position: absolute;
  right: 10px;
  width: 20px;
  height: 20px;
`;

type ToastPopupViewProps = MainTextProps & {
  isDeletable: boolean;
  direction: TOAST_DIRECTION;
  onClickDeleteButton: () => void;
};

export const ToastPopupView = forwardRef<HTMLDivElement, ToastPopupViewProps>(
  ({ isDeletable, direction, onClickDeleteButton }, ref) => {
    const { toastText, toastColor, toastBackgroundColor } = useSelector(
      (state: RootState) => state.toastPopup
    );
    return (
      <PopupContainer
        ref={ref}
        $backgroundColor={toastBackgroundColor}
        $direction={direction}
      >
        {toastText && <MainText color={toastColor}>{toastText}</MainText>}
        {isDeletable && <CancelButton onClick={onClickDeleteButton} />}
      </PopupContainer>
    );
  }
);
