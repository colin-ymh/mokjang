'use client';

import React, {
  ChangeEvent,
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import TransparentBackground from '@/components/atoms/common/etc/transparent-background';
import { InputProps } from '@/components/atoms/common/input/main-input';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';
import MemberDropdownView from '@/components/atoms/common/dropdown/member-dropdown.view';

export type DropdownProps = InputProps & {
  ref?: RefObject<HTMLInputElement>;
  items: MemberDropdownType[]; // dropdown 선택 가능 요소들
  value: any; // dropdown 에서 선택된 값
  onChangeItem?: (value: any) => void;
  //
  isShowTitle?: boolean;
  isEditable?: boolean;
  //
  reverseDirection?: boolean;
  backgroundBlur?: boolean; // 드롭다운 클릭 배경 흐려짐
  //
  enterKeyHint?: string;
  placeholder?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClickItemExtra?: (event?: any) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  borderColor?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
};

const MemberDropdown = forwardRef<HTMLInputElement, DropdownProps>(
  (
    {
      items,
      value,
      onChangeItem,
      backgroundBlur = true,
      reverseDirection = false,
      isEditable = false,
      enterKeyHint = 'enter',
      onClickItemExtra,
      onChange,
      borderColor,
      backgroundColor,
      width,
      height,
      disabled,
      ...inputProps
    },
    ref
  ) => {
    // 드롭다운 활성화 여부
    const [isOpened, setIsOpened] = useState(false);

    // 드롭다운 내에서 관리하는 value (외부 데이터를 직접 수정하지 않도록 관리)
    const [innerValue, setInnerValue] = useState<any>(value);

    useEffect(() => {
      setInnerValue(value);
    }, [value]);

    // 현재 포커스된 인덱스 (상태)
    const [focusedIndex, setFocusedIndex] = useState<number>(0);
    // 항상 최신 focusedIndex를 저장하는 ref
    const focusedIndexRef = useRef<number>(focusedIndex);

    // 이전 items.length를 추적하기 위한 Ref
    const prevItemsLength = useRef<number>(items.length);

    // 드롭다운 외부 영역 클릭 시 일어나는 이벤트
    const onClickBackground = () => {
      setIsOpened(false);
    };

    // 드롭다운 영역 클릭 시 일어나는 이벤트
    const onClickDropdown = () => {
      if (items.length === 0) return; // 처음 클릭 시 items가 비어있다면 열리지 않음
      // 나머지 disabled 검사 등...
      setIsOpened((prev) => !prev);
    };

    // 드롭다운 아이템 선택 시 일어나는 이벤트
    const onClickItem = (value: any) => {
      // 열려있던 드롭다운 닫고
      setIsOpened(false);
      setInnerValue(value);

      // 외부에서 onChangeItem 을 넘겨줬었다면
      if (onChangeItem) {
        // 선택된 아이템이 유효한지 확인 후에
        const newItem = items.find((item) => value === item.value);
        // 유효하다면, 해당 아이템의 value 만 외부로 전달
        if (newItem) {
          onChangeItem(newItem.value);
        }
      }

      // 추가적인 동작이 필요한 경우
      if (onClickItemExtra) onClickItemExtra();
    };

    // input 창에 직접 입력하는 경우 (직접입력)
    const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
      if (isEditable) {
        // input 창에 입력되는 새로운 value
        const newValue = event.target.value;
        // 내부 데이터 우선 수정
        setInnerValue(newValue);
        // input 창에 직접 입력한 값을 실제 value 로 사용하지 않으려는 경우
        if (onChange) {
          onChange(event);
        }
        // input 창에 직접 입력한 값을 실제 value 로 사용하려는 경우
        // 외부에서 onChangeItem 을 넘겨줬었다면
        else if (onChangeItem) {
          // 외부에 해당 value 전달
          onChangeItem(newValue);
        }
      }
    };

    // 외부에서 드롭다운 아이템들이 변경
    useEffect(() => {
      if (prevItemsLength.current === 0 && items.length > 0) {
        // 이전엔 비어있었는데 지금은 채워졌다면...
        setIsOpened(true); // 자동으로 열기
      }
      // 매번 마지막에 현재 길이를 저장
      prevItemsLength.current = items.length;
    }, [items]);

    const onFocusInput = () => {
      // setIsOpened(true);
    };

    /** 키보드 핸들러 (Functional Update와 ref 동기화 사용) */
    const onKeyDownHandler = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpened) return;
        if (event.keyCode === 229) return;
        if (items.length === 0) return;

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
          // 최신 인덱스는 ref에 저장된 값을 사용
          const currentIndex = focusedIndexRef.current;
          if (items[currentIndex]) {
            onChangeItem?.(items[currentIndex].value);
          }
          setIsOpened(false);
        } else if (event.key === 'Escape') {
          setIsOpened(false);
        }
      },
      [isOpened, items, onChangeItem]
    );

    // 전역 이벤트 리스너 대신, 가능하면 해당 input에 직접 onKeyDown을 전달하는 것이 좋습니다.
    // 여기서는 window에 리스너를 등록하는 방식으로 구현.
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

    const props = {
      ref,
      //
      items,
      innerValue,
      focusedIndex,
      //
      isOpened,
      onClickDropdown,
      onClickItem,
      onChangeInput,
      onKeyDownHandler,
      onFocusInput,
      enterKeyHint,

      // style
      reverseDirection,
      isEditable,
      borderColor,
      width,
      height,
      backgroundColor,

      //inputProps

      ...inputProps,
    };

    return (
      <>
        {/* 빈 공간 터치 시에 드롭다운 off */}
        <TransparentBackground
          isOpened={isOpened}
          onClick={onClickBackground}
          // 직접 수정인 경우에는 외부 영역 흐리게 처리 안함
          blur={backgroundBlur && !isEditable}
        />
        {/* 드롭다운 렌더링 */}
        <MemberDropdownView {...props} />
      </>
    );
  }
);

export default MemberDropdown;
