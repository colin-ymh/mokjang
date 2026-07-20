'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { MainText } from '@mokjang/components';
import { DESTRUCTIVE, MAIN, WHITE } from '@mokjang/constants';
import { SIZE } from '@mokjang/constants';

interface ConfirmPopupProps {
  title: string;
  body: string;
  leftButtonText?: string;
  rightButtonText?: string;
  onClickLeftButton?: () => void;
  onClickRightButton?: () => void;
  isShow: boolean;
  buttonNum?: 1 | 2 | 3;
  singleButtonText?: string;
  onClickSingleButton?: () => void;
  middleButtonText?: string;
  onClickMiddleButton?: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center; /* ✅ 중앙 정렬 */
  justify-content: center; /* ✅ 중앙 정렬 */
  z-index: 10000; /* ✅ 최상단 레이어 */
`;

const ModalContainer = styled.div`
  background-color: #fff;
  min-width: 254px;
  max-width: calc(100vw - 40px);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  text-align: center;
  margin: 20px 25px 0 25px;
  white-space: pre-wrap;
  word-break: break-word;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  width: 254px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TwoButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 254px;
  height: 65px;
`;

const Button = styled.button`
  width: 120px;
  height: 52px;
  border: none;
  background-color: transparent;
  font-size: 15px;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 0.2s;
`;

const LeftButton = styled(Button)`
  width: 96px;
  height: 33px;
  border-radius: 5px;
  color: ${DESTRUCTIVE.DEFAULT};
  background-color: ${WHITE};
`;

const RightButton = styled(Button)`
  width: 96px;
  height: 33px;
  border-radius: 5px;
  color: ${WHITE};
  background-color: ${MAIN.DEFAULT};
`;

const SingleButton = styled(Button)`
  width: 254px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  color: blue;
`;

const ThreeButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 254px;
  height: 135px;
  align-items: center;
  justify-content: center;
`;

/** Portal root를 준비하는 훅 (SSR-safe) */
function usePortalRoot(id = 'modal-root') {
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let root = document.getElementById(id) as HTMLElement | null;
    let created = false;

    if (!root) {
      root = document.createElement('div');
      root.id = id;
      document.body.appendChild(root);
      created = true;
    }

    setEl(root);

    return () => {
      // root를 항상 제거하진 말고, 우리가 생성했을 때만 정리
      if (created && root?.parentNode) {
        root.parentNode.removeChild(root);
      }
    };
  }, [id]);

  return el;
}

const ConfirmPopup = ({
  title,
  body,
  leftButtonText,
  rightButtonText,
  onClickLeftButton,
  onClickRightButton,
  isShow,
  buttonNum,
  singleButtonText,
  onClickSingleButton,
  middleButtonText,
  onClickMiddleButton,
}: ConfirmPopupProps) => {
  const portalRoot = usePortalRoot(); // 기본: #modal-root

  // 모달이 켜졌을 때 body 스크롤 잠금 (선택)
  useEffect(() => {
    if (!isShow) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isShow]);

  if (!isShow || !portalRoot) return null;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const getButtons = () => {
    switch (buttonNum) {
      case 1:
        return (
          <ButtonContainer>
            <SingleButton
              onClick={(event) => {
                event.stopPropagation();
                onClickSingleButton && onClickSingleButton();
              }}
            >
              {singleButtonText}
            </SingleButton>
          </ButtonContainer>
        );
      case 2:
        return (
          <ButtonContainer>
            <TwoButtonContainer>
              <LeftButton
                onClick={(event) => {
                  event.stopPropagation();
                  onClickLeftButton && onClickLeftButton();
                }}
              >
                {leftButtonText}
              </LeftButton>
              <RightButton
                onClick={(event) => {
                  event.stopPropagation();
                  onClickRightButton && onClickRightButton();
                }}
              >
                {rightButtonText}
              </RightButton>
            </TwoButtonContainer>
          </ButtonContainer>
        );
      case 3:
        return (
          <ThreeButtonContainer>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                onClickLeftButton && onClickLeftButton();
              }}
            >
              {leftButtonText}
            </Button>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                onClickMiddleButton && onClickMiddleButton();
              }}
            >
              {middleButtonText}
            </Button>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                onClickRightButton && onClickRightButton();
              }}
            >
              {rightButtonText}
            </Button>
          </ThreeButtonContainer>
        );
      default:
        return (
          <ButtonContainer>
            <SingleButton
              onClick={(event) => {
                event.stopPropagation();
                onClickSingleButton && onClickSingleButton();
              }}
            >
              {singleButtonText}
            </SingleButton>
          </ButtonContainer>
        );
    }
  };

  // ✅ Portal로 body(#modal-root) 아래에 렌더
  return createPortal(
    <ModalOverlay role="dialog" aria-modal="true" onClick={handleClick}>
      <ModalContainer onClick={handleClick}>
        <TextContainer>
          <MainText fontWeight={500}>{title}</MainText>
          <MainText size={SIZE.SMALL}>{body}</MainText>
        </TextContainer>
        {getButtons()}
      </ModalContainer>
    </ModalOverlay>,
    portalRoot
  );
};

export default ConfirmPopup;
