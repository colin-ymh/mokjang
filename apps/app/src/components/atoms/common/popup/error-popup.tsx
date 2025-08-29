import React from 'react';
import styled from 'styled-components';
import { MainText } from '../text/main-text';
import { DESTRUCTIVE, MAIN, WHITE } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';

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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  min-width: 254px;
  border-radius: 5px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.3);
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
  transition: background-color 0.3s;
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
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
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
  if (!isShow) return null;

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

  return (
    <ModalOverlay onClick={handleClick}>
      <ModalContainer onClick={handleClick}>
        <TextContainer>
          <MainText fontWeight={500}>{title}</MainText>
          <MainText size={SIZE.SMALL}>{body}</MainText>
        </TextContainer>
        {getButtons()}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ConfirmPopup;
