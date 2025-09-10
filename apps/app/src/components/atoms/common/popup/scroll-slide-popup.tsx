import styled from 'styled-components';
import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  CURSOR,
  DIRECTION,
  GRAY,
  LOCALE,
  MAIN,
  MEDIA_MAX_WIDTH,
  SIZE,
  TASK_STATUS,
  WHITE,
} from '@mokjang/constants';
import { MainText, PopupLayout, SvgIcon } from '@mokjang/components';
import { Member } from '@mokjang/models';
import { getTranslatedDateFromDateString } from '@mokjang/utils';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { useScopedI18n } from '../../../../../locales/client';
import { Svg } from '@mokjang/assets';
import { usePathname } from 'next/navigation';
import { useTaskStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';

const SlidePanel = styled.div<{
  $isShow: boolean;
  direction: DIRECTION;
  size: number;
  $isPercentage: boolean;
  $isAnimation: boolean;
}>`
  position: fixed;
  background-color: ${WHITE};
  z-index: 50;

  /* 애니메이션 온/오프 */
  transition: ${({ $isAnimation }) =>
    $isAnimation ? 'transform 0.3s ease-in-out' : 'none'};

  display: flex;
  flex-direction: column;
  box-shadow: ${({ $isShow }) => $isShow && `0 2px 10px rgba(0, 0, 0, 0.3)`};

  ${({ direction, $isShow, size, $isPercentage }) => {
    const sizeValue = $isPercentage
      ? direction === DIRECTION.LEFT || direction === DIRECTION.RIGHT
        ? `${size}vw`
        : `${size}vh`
      : `${size}px`;
    switch (direction) {
      case DIRECTION.LEFT:
        return `
        top: 0;
        bottom: 0;
        left: 0;
        width: ${sizeValue};
        transform: translateX(${$isShow ? 0 : '-100%'});
      `;
      case DIRECTION.RIGHT:
        return `
        top: 0;
        bottom: 0;
        right: 0;
        width: ${sizeValue};
        transform: translateX(${$isShow ? 0 : '100%'});
      `;
      case DIRECTION.TOP:
        return `
        left: 0;
        right: 0;
        top: 0;
        height: ${sizeValue};
        transform: translateY(${$isShow ? 0 : '-100%'});
      `;
      case DIRECTION.BOTTOM:
        return `
        left: 0;
        right: 0;
        bottom: 0;
        height: ${sizeValue};
        transform: translateY(${$isShow ? 0 : '100%'});
      `;
      default:
        return '';
    }
  }};

  @media (max-width: ${MEDIA_MAX_WIDTH.TABLET}) {
    ${({ direction }) =>
      direction === DIRECTION.LEFT || direction === DIRECTION.RIGHT
        ? 'width: 100%;'
        : 'height: 100%;'}
  }

  @media (max-width: ${MEDIA_MAX_WIDTH.DESKTOP}) {
    ${({ direction }) => {
      switch (direction) {
        case DIRECTION.LEFT:
          return `border-right: 1px solid ${GRAY.SEMI_LIGHT};`;
        case DIRECTION.RIGHT:
          return `border-left: 1px solid ${GRAY.SEMI_LIGHT};`;
        case DIRECTION.TOP:
          return `border-bottom: 1px solid ${GRAY.SEMI_LIGHT};`;
        case DIRECTION.BOTTOM:
          return `border-top: 1px solid ${GRAY.SEMI_LIGHT};`;
        default:
          return '';
      }
    }};
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
`;

const HeaderLeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  padding-left: 20px;
`;

const HeaderRightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const CancelContainer = styled.div`
  display: flex;
  margin-right: 10px;
  cursor: pointer;
`;

const HeaderTitle = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;
`;

enum INTEGRATE_STAGE {
  ONE = 'one',
  TWO = 'two',
}

type ScrollSlidePopupProps = {
  isShow: boolean;
  direction?: DIRECTION;
  size?: number;
  isPercentage?: boolean;
  isAnimation?: boolean; // 👈 추가 (기본 true)

  isFooterShown?: boolean;
  onClickClose: () => void;
  onClickCancel: () => void;
  onClickDone?: () => void;
  headerTitle?: string;
  headerDescription?: string;
  headerLeft?: ReactNode;
  headerHeight?: number;
  headerRight?: ReactNode;
  cancelText?: string;
  doneText?: string;
  cancelBackgroundColor?: string;
  doneBackgroundColor?: string;
  doneDisabled?: boolean;
  doneIcon?: ReactNode;
  cancelIcon?: ReactNode;
  disabledKeyboard?: boolean;
  children: ReactNode;

  // 스크롤 전환용
  stageTwoTop?: number;

  // 고정 보여줄 데이터
  status?: TASK_STATUS;
  onChangeStatus?: (status: TASK_STATUS) => void;
  inCharge?: Member;
  startDate?: string;
  endDate?: string;
};

const ScrollSlidePopup = ({
  isShow,
  direction = DIRECTION.RIGHT,
  size = 650,
  isPercentage = false,
  isAnimation = true,

  isFooterShown,
  onClickClose,
  onClickCancel,
  onClickDone,
  headerTitle,
  headerDescription,
  headerLeft,
  headerHeight,
  headerRight,
  cancelText,
  doneText,
  cancelBackgroundColor,
  doneBackgroundColor,
  doneDisabled,
  disabledKeyboard = false,
  children,

  stageTwoTop,
  status,
  onChangeStatus,
  inCharge,
  startDate,
  endDate,
}: ScrollSlidePopupProps) => {
  const t_button = useScopedI18n('button');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [integrateStage, setIntegrateStage] = useState(INTEGRATE_STAGE.ONE);

  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const statusDropdownItems = useTaskStatusDropdownItems();

  // ESC 닫기
  useEffect(() => {
    if (disabledKeyboard) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClickClose();
    };
    if (isShow) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShow, onClickClose, disabledKeyboard]);

  // 스크롤 단계 전환 (ONE ↔ TWO)
  useEffect(() => {
    const handleScroll = () => {
      const el = scrollRef.current;
      if (!el) return;
      const top = el.scrollTop;

      if (stageTwoTop && top >= stageTwoTop) {
        if (integrateStage !== INTEGRATE_STAGE.TWO) {
          setIntegrateStage(INTEGRATE_STAGE.TWO);
        }
      } else {
        if (integrateStage !== INTEGRATE_STAGE.ONE) {
          setIntegrateStage(INTEGRATE_STAGE.ONE);
        }
      }
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      return () => {
        el.removeEventListener('scroll', handleScroll);
      };
    }

    // el이 없으면 cleanup 없이 종료 (undefined 반환)
    return;
  }, [stageTwoTop, integrateStage]);

  // 왼쪽 : 타이틀(+설명) 항상, 2단계에서 멤버/기간 추가
  const leftActions = (
    <HeaderLeftContainer>
      <HeaderTitle>
        <MainText size={SIZE.EXTRA_LARGE} fontSize={22}>
          {headerTitle}
        </MainText>
        {headerDescription && (
          <MainText color={GRAY.SEMI_DARK}>{headerDescription}</MainText>
        )}
      </HeaderTitle>

      {integrateStage === INTEGRATE_STAGE.TWO && inCharge && (
        <MemberProfilePopupButton member={inCharge} width={20} height={20} />
      )}
      {integrateStage === INTEGRATE_STAGE.TWO && startDate && endDate && (
        <MainText size={SIZE.SMALL}>
          {`${getTranslatedDateFromDateString(locale, startDate)} - ${getTranslatedDateFromDateString(
            locale,
            endDate
          )}`}
        </MainText>
      )}
    </HeaderLeftContainer>
  );

  // 오른쪽(1/2단계 공통): StatusDropdown + 닫기 버튼
  const rightActions = (
    <HeaderRightActions>
      {status && onChangeStatus && (
        <StatusDropdown
          value={status}
          items={statusDropdownItems}
          onChangeItem={onChangeStatus}
          width={100}
          height={30}
        />
      )}
      <CancelContainer onClick={onClickClose}>
        <SvgIcon svg={Svg.Cancel} size={22} cursor={CURSOR.POINTER} />
      </CancelContainer>
    </HeaderRightActions>
  );

  return (
    <SlidePanel
      $isShow={isShow}
      direction={direction}
      size={size}
      $isPercentage={isPercentage}
      $isAnimation={isAnimation}
      onClick={(e) => e.stopPropagation()}
    >
      <PopupLayout
        onClickClose={onClickClose}
        onClickCancel={onClickCancel}
        onClickDone={onClickDone}
        headerTitle={headerTitle}
        headerLeft={headerLeft || leftActions}
        headerRight={rightActions}
        headerHeight={headerHeight}
        doneText={doneText || t_button('save')}
        cancelText={cancelText || t_button('cancel')}
        doneBackgroundColor={doneBackgroundColor || MAIN.DEFAULT}
        cancelBackgroundColor={cancelBackgroundColor}
        doneDisabled={doneDisabled}
        isFooterShown={isFooterShown}
      >
        <ContentWrapper ref={scrollRef}>{children}</ContentWrapper>
      </PopupLayout>
    </SlidePanel>
  );
};

export default ScrollSlidePopup;
