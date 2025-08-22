'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import TransparentBackground from '@/components/atoms/common/etc/transparent-background';
import KebabDropdownView, {
  KebabDropdownValueType,
} from '@/components/atoms/common/dropdown/kebab-dropdown.view';

type KebabDropdownProps = {
  items: KebabDropdownValueType[]; // dropdown 선택 가능 요소들

  // 동작 관련 옵션
  backgroundBlur?: boolean; // 드롭다운 클릭 배경 흐려짐

  // 입력/키보드 관련
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  // 스타일 관련
  width?: number;
};

const KebabDropdown = ({
  items,
  backgroundBlur = false,
  width,
  ...inputProps
}: KebabDropdownProps) => {
  // 드롭다운 열림 여부
  const [isOpened, setIsOpened] = useState(false);

  // 키보드 포커스 인덱스 (상태)
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  // 최신 focusedIndex를 저장하는 ref (항상 최신값 사용)
  const focusedIndexRef = useRef<number>(focusedIndex);

  /** 드롭다운 열고 닫기 */
  const onClickKebab = useCallback(() => {
    setIsOpened((prev) => !prev);
  }, [isOpened]);

  /** 배경 클릭 시 닫기 */
  const onClickBackground = useCallback(() => {
    setIsOpened(false);
  }, []);

  /** 키보드 핸들러 */
  const onKeyDownHandler = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpened) return;
      if (event.keyCode === 229) return; // 한글 입력 등 무시

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusedIndex((prevIndex) => {
          const newIndex = (prevIndex + items.length - 1) % items.length;
          focusedIndexRef.current = newIndex;
          return newIndex;
        });
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setFocusedIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % items.length;
          focusedIndexRef.current = newIndex;
          return newIndex;
        });
      } else if (event.key === 'Enter') {
        event.preventDefault();
        // 최신 focusedIndex 값을 ref에서 사용
        const index = focusedIndexRef.current;

        items[index]?.onClick && items[index].onClick();

        setIsOpened(false);
      } else if (event.key === 'Escape') {
        setIsOpened(false);
      }
    },
    [isOpened, items]
  );

  // 전역 이벤트 대신, 인풋 자체의 onKeyDown에 달거나,
  // 전역 리스너 사용 시, functional update를 사용하여 최신 focusedIndexRef 유지
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      onKeyDownHandler(
        event as unknown as React.KeyboardEvent<HTMLInputElement>
      );
    };
    if (isOpened) {
      window.addEventListener('keydown', listener);
    }
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [isOpened, onKeyDownHandler]);

  const propsForView = {
    items,
    focusedIndex,
    isOpened,
    width,

    onClickKebab,
    onKeyDownHandler,
    ...inputProps,
  };

  return (
    <>
      <TransparentBackground
        isOpened={isOpened}
        onClick={onClickBackground}
        blur={backgroundBlur}
        zIndex={10}
      />
      <KebabDropdownView {...propsForView} />
    </>
  );
};

export default KebabDropdown;
