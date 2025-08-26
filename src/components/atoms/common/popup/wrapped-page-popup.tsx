'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';

import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import Hide from '@/components/atoms/common/etc/hide';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useScopedI18n } from '../../../../../locales/client';

import ArrowUp from '../../../../../public/svg/arror-up.svg';
import Button from '@/components/atoms/common/button/button';
import TransparentBackground from '@/components/atoms/common/etc/transparent-background';
import { TASK_STATUS } from '@/constants/status/status';
import { useTaskStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { SIZE } from '@/constants/styles/style';
import { Member } from '@/models/member/member';
import KebabDropdown from '@/components/atoms/common/dropdown/kebab-dropdown';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';
import { getDateFromDateString, getDateStringFromDate } from '@/utils/date';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';

const WrappedPagePopupContainer = styled.div<{
  $widthPercentage: number;
  $zIndex?: number;
}>`
  display: flex;
  flex-direction: column;
  position: fixed; /* 포털과 함께 항상 뷰포트 고정 */
  /* iOS Safari 등 브라우저 간 일관성을 위해 inset 사용 */
  inset: 0;
  /* 가운데 정렬을 위해 좌우 여백 재설정 */
  left: ${({ $widthPercentage }) => `${(100 - $widthPercentage) / 2}%`};
  right: ${({ $widthPercentage }) => `${(100 - $widthPercentage) / 2}%`};

  background-color: ${WHITE};
  z-index: ${({ $zIndex }) => $zIndex || 1000};
`;

const HeaderContainer = styled.div<{ $isShadowShown?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  flex-shrink: 0;
  padding: 0 30px;
  box-shadow: ${({ $isShadowShown }) =>
    $isShadowShown ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none'};
  z-index: 1000;
`;

const HeaderLeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const HeaderRightContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const GoBackContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  height: 30px;
  cursor: pointer;
`;

const ArrowLeft = styled(ArrowUp)`
  width: 14px;
  height: 14px;
  stroke-width: 2px;
  stroke: ${MAIN.DEFAULT};
  transform: rotate(270deg);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
`;

interface WrappedPagePopupProps {
  isShow: boolean;
  onClickClose: () => void;
  onClickDone?: () => void;
  onClickCancel?: () => void;
  doneText?: string;
  cancelText?: string;
  doneBackgroundColor?: string;
  doneDisabled?: boolean;
  hideDone?: boolean;
  hideCancel?: boolean;
  rightButtonShown?: boolean;
  stageTwoTop?: number;
  stageThreeTop?: number;
  headerTitle?: string;
  status?: TASK_STATUS;
  onChangeStatus?: (status: TASK_STATUS) => void;
  inCharge?: Member;
  startDate?: string;
  endDate?: string;
  keyboardDisabled?: boolean;
  widthPercentage?: number;
  zIndex?: number;
  closeText?: string;
  children:
    | ReactNode
    | ((scrollRef: React.RefObject<HTMLDivElement>) => ReactNode);
}

enum INTEGRATE_STAGE {
  ONE = 'one',
  TWO = 'two',
  THREE = 'three',
}

// 특정 컴포넌트를 전체화면 페이지인 것처럼 보아게 해주는 모달
const WrappedPagePopup = ({
  isShow,
  onClickClose,
  onClickDone,
  onClickCancel,
  closeText,
  doneBackgroundColor = MAIN.DEFAULT,
  doneDisabled = false,
  doneText,
  hideDone = false,
  hideCancel = false,
  cancelText,
  keyboardDisabled = false,
  widthPercentage = 70,
  rightButtonShown = true,
  stageTwoTop,
  stageThreeTop,
  headerTitle,
  status,
  onChangeStatus,
  inCharge,
  startDate,
  endDate,
  children,
  zIndex,
}: WrappedPagePopupProps) => {
  const t_button = useScopedI18n('button');
  const statusDropdownItems = useTaskStatusDropdownItems();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [integrateStage, setIntegrateStage] = useState<INTEGRATE_STAGE>(
    INTEGRATE_STAGE.ONE
  );

  // ---- Portal 마운트 플래그 (SSR 안전)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const scrollTop = scrollRef.current.scrollTop;

      if (stageThreeTop && scrollTop >= stageThreeTop) {
        setIntegrateStage(INTEGRATE_STAGE.THREE);
      } else if (stageTwoTop && scrollTop >= stageTwoTop) {
        setIntegrateStage(INTEGRATE_STAGE.TWO);
      } else {
        setIntegrateStage(INTEGRATE_STAGE.ONE);
      }
    };

    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (ref) {
        ref.removeEventListener('scroll', handleScroll);
      }
    };
  }, [children, stageTwoTop, stageThreeTop]);

  useEffect(() => {
    if (keyboardDisabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClickClose();
      }
    };
    if (isShow) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isShow, onClickClose, keyboardDisabled]);

  useEffect(() => {
    if (isShow) {
      setIntegrateStage(INTEGRATE_STAGE.ONE);
      // 열릴 때 컨텐츠 스크롤 최상단으로
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    }
  }, [isShow]);

  if (!isShow || !mounted) {
    return <Hide />;
  }

  const modal = (
    <>
      <TransparentBackground
        isOpened={isShow}
        onClick={onClickClose}
        zIndex={zIndex}
      />
      <WrappedPagePopupContainer
        $widthPercentage={widthPercentage}
        $zIndex={zIndex}
      >
        <HeaderContainer
          $isShadowShown={integrateStage !== INTEGRATE_STAGE.ONE}
        >
          <HeaderLeftContainer>
            <GoBackContainer onClick={onClickClose}>
              <ArrowLeft />
              <MainText color={MAIN.DEFAULT}>
                {integrateStage === INTEGRATE_STAGE.ONE
                  ? closeText || t_button('backToList')
                  : headerTitle}
              </MainText>
            </GoBackContainer>

            {integrateStage === INTEGRATE_STAGE.THREE && inCharge && (
              <MemberProfilePopupButton
                member={inCharge}
                width={20}
                height={20}
              />
            )}
            {integrateStage === INTEGRATE_STAGE.THREE &&
              startDate &&
              endDate && (
                <MainText size={SIZE.SMALL}>
                  {`${getDateStringFromDate(getDateFromDateString(startDate))} - ${getDateStringFromDate(getDateFromDateString(endDate))}`}
                </MainText>
              )}
          </HeaderLeftContainer>
          <HeaderRightContainer $isShown={rightButtonShown}>
            {integrateStage !== INTEGRATE_STAGE.ONE &&
              status &&
              onChangeStatus && (
                <StatusDropdown
                  value={status}
                  items={statusDropdownItems}
                  onChangeItem={onChangeStatus}
                  width={100}
                  height={30}
                />
              )}
            {/* 버튼 */}
            {integrateStage === INTEGRATE_STAGE.ONE ? (
              <ButtonContainer>
                {!hideDone && (
                  <Button
                    width={80}
                    height={30}
                    color={WHITE}
                    backgroundColor={doneBackgroundColor}
                    onClick={onClickDone}
                    text={doneText || t_button('save')}
                    disabled={doneDisabled}
                  />
                )}
                {!hideCancel && (
                  <Button
                    width={80}
                    height={30}
                    color={GRAY.DEFAULT}
                    backgroundColor={WHITE}
                    onClick={onClickCancel}
                    borderColor={GRAY.SEMI_LIGHT}
                    text={cancelText || t_button('cancel')}
                  />
                )}
              </ButtonContainer>
            ) : (
              <KebabDropdown
                items={[
                  {
                    value: 'done',
                    title: doneText || t_button('save'),
                    onClick: onClickDone,
                  },
                  {
                    value: 'cancel',
                    title: cancelText || t_button('cancel'),
                    onClick: onClickCancel,
                  },
                ]}
                width={100}
              />
            )}
          </HeaderRightContainer>
        </HeaderContainer>

        <ContentWrapper ref={scrollRef}>
          {typeof children === 'function' ? children(scrollRef) : children}
        </ContentWrapper>
      </WrappedPagePopupContainer>
    </>
  );

  // ---- 핵심: Portal로 body에 렌더링하여 부모 컨텍스트(스크롤/transform/z-index) 영향 제거
  return createPortal(modal, document.body);
};

export default WrappedPagePopup;
