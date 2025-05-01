import React, { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import TransparentBackground from '@/components/atoms/common/etc/transparent-background';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';

import Kebab from '../../../../../public/svg/kebab.svg';
import { useScopedI18n } from '../../../../../locales/client';

const ListContainer = styled.div<{
  $position: string;
  top: number;
  right: number;
}>`
  display: flex;
  position: ${({ $position }) => $position};
  right: ${({ right }) => right}px;
  top: ${({ top }) => top}px;
  border-radius: 5px;
`;

// Kebab 버튼
const KebabButton = styled(Kebab)<{ $buttonSize: number }>`
  display: flex;
  width: ${({ $buttonSize }) => $buttonSize}px;
  height: ${({ $buttonSize }) => $buttonSize}px;
  stroke: ${GRAY.DARK};
  cursor: pointer;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    position: relative;
  }
`;

const Dropdown = styled.div<{ $isOpened: boolean }>`
  /* 항상 자리는 차지하고, 보이는지 여부는 visibility로 제어 */
  display: flex;
  visibility: ${({ $isOpened }) => ($isOpened ? 'visible' : 'hidden')};
  pointer-events: ${({ $isOpened }) => ($isOpened ? 'auto' : 'none')};
  flex-direction: row;
  overflow: hidden;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    transform: translateY(100%); /* ↓ 초기 상태: 화면 아래 */
    position: fixed;
    bottom: 70px;
    left: 10px;
    right: 10px;
    flex-direction: column;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    background-color: ${GRAY.LIGHT};
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    gap: 10px;
    top: 35px;
    left: auto;
    bottom: auto;
    right: 0;
    border-radius: 5px;
    position: absolute;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
`;

const ButtonItem = styled.div`
  display: flex;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    padding: 10px;
    height: 30px;
    justify-content: center;
    align-items: center;
    background-color: ${GRAY.LIGHT};

    border-bottom: 1px solid ${GRAY.SEMI_LIGHT};

    &:last-child {
      border-bottom: none;
    }
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: ${GRAY.SEMI_LIGHT};
    }
  }
`;

const CancelButton = styled.div<{ $isOpened: boolean }>`
  display: flex;
  visibility: ${({ $isOpened }) => ($isOpened ? 'visible' : 'hidden')};
  pointer-events: ${({ $isOpened }) => ($isOpened ? 'auto' : 'none')};
  padding: 10px;
  height: 30px;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 10px;
  left: 10px;
  right: 10px;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  background-color: ${GRAY.SEMI_LIGHT};
  transform: translateY(100%); /* ↓ 초기 상태 */

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: none;
  }
`;

type EditDeleteModalProps = {
  onClickEdit?: (...args: any[]) => void;
  onClickDelete?: (...args: any[]) => void;
  onClickAdd?: (...args: any[]) => void;
  buttonSize?: number;
  top?: number;
  right?: number;
  position?: string;
};

const KebabDropdown = ({
  onClickEdit,
  onClickDelete,
  onClickAdd,
  buttonSize = 18,
  top = 0,
  right = 0,
  position = 'relative',
}: EditDeleteModalProps) => {
  const t_button = useScopedI18n('button');
  const [isOpened, setIsOpened] = useState(false);

  /** 버튼 컨테이너 ref */
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  /** Cancel 버튼 ref */
  const cancelRef = useRef<HTMLDivElement | null>(null);

  /** ★ 현재 뷰포트를 한 번만 판단 (Client 전용) */
  const isMobile = () => {
    if (typeof window === 'undefined') return false; // SSR 안전
    return window.matchMedia(
      `(max-width: ${parseInt(MEDIA_MIN_WIDTH.DESKTOP) - 1}px)`
    ).matches;
  };

  /** ▼ 열기 */
  const openDropdown = () => {
    if (!isMobile()) {
      // ★ 데스크탑: 애니메이션 없이 즉시 표시
      setIsOpened(true);
      return;
    }
    setIsOpened(true); // 모바일: 애니메이션을 위해 먼저 표시
  };

  /** ▲ 닫기 */
  const closeDropdown = () => {
    const dropdownEl = dropdownRef.current;
    const cancelEl = cancelRef.current;

    if (!isMobile()) {
      // ★ 데스크탑: 애니메이션 없이 즉시 닫힘
      setIsOpened(false);
      return;
    }

    if (dropdownEl && cancelEl) {
      gsap.to([dropdownEl, cancelEl], {
        y: '100%',
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setIsOpened(false),
      });
    } else {
      setIsOpened(false);
    }
  };

  /** 모바일 열림 애니메이션 */
  useLayoutEffect(() => {
    if (!isOpened || !isMobile()) return; // ★ 데스크탑이면 패스

    if (dropdownRef.current && cancelRef.current) {
      const dropdownEl = dropdownRef.current;
      const cancelEl = cancelRef.current;

      gsap.fromTo(
        [dropdownEl, cancelEl],
        { y: '100%', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [isOpened]);

  const handleToggle = () => {
    isOpened ? closeDropdown() : openDropdown();
  };

  return (
    <ListContainer
      $position={position}
      top={top}
      right={right}
      onClick={(event) => event.stopPropagation()}
    >
      <TransparentBackground isOpened={isOpened} onClick={closeDropdown} />

      {/* 케밥(⋮) 아이콘 */}
      <KebabButton $buttonSize={buttonSize} onClick={handleToggle} />

      {/* 드롭다운 버튼 모음 */}
      <Dropdown ref={dropdownRef} $isOpened={isOpened}>
        {onClickAdd && (
          <ButtonItem onClick={onClickAdd}>
            <MainText color={GRAY.DARK}>{t_button('save')}</MainText>
          </ButtonItem>
        )}
        {onClickEdit && (
          <ButtonItem onClick={onClickEdit}>
            <MainText color={GRAY.DARK}>{t_button('edit')}</MainText>
          </ButtonItem>
        )}
        {onClickDelete && (
          <ButtonItem onClick={onClickDelete}>
            <MainText color={GRAY.DARK}>{t_button('delete')}</MainText>
          </ButtonItem>
        )}
      </Dropdown>

      {/* 모바일 전용 ‘취소’ 버튼 */}
      <CancelButton
        ref={cancelRef}
        onClick={closeDropdown}
        $isOpened={isOpened}
      >
        <MainText color={GRAY.DARK}>{t_button('cancel')}</MainText>
      </CancelButton>
    </ListContainer>
  );
};

export default KebabDropdown;
