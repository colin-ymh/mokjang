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
import DropdownView from '@/components/atoms/common/dropdown/dropdown.view';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { BorderInputProps } from '@/components/atoms/common/input/border-input';
import useWindowSize from '@/hooks/window/window';

export type DropdownProps<
  ItemType extends DropdownValueType = DropdownValueType,
> = BorderInputProps & {
  ref?: RefObject<HTMLInputElement>;
  items: ItemType[]; // dropdown 선택 가능 요소들
  value: any; // dropdown에서 선택된 값
  onChangeItem?: (value: any) => void;

  // 동작 관련 옵션
  isShowTitle?: boolean;
  isEditable?: boolean;
  backgroundBlur?: boolean; // 드롭다운 클릭 배경 흐려짐

  // 입력/키보드 관련
  enterKeyHint?: string;
  placeholder?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClickItemExtra?: (event?: any) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;

  // 스타일 관련
  borderColor?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;

  // ===============================
  // 새로 추가된 부분
  // ===============================
  customValue?: string;
  /** '직접 입력' 기능 사용 여부 */
  isCustom?: boolean;
  /** 사용자가 직접 입력한 텍스트가 바뀔 때 호출할 콜백 */
  onChangeCustomInput?: (event: ChangeEvent<HTMLInputElement>) => void;
  isChevronShown?: boolean;
  isRight?: boolean;
  onScrollBottom?: () => void;
  CustomDropdownButton?: React.ComponentType<any>;
};

export const CUSTOM_VALUE = 'custom';

const Dropdown = forwardRef<HTMLInputElement, DropdownProps>(
  (
    {
      items,
      value,
      onChangeItem,
      backgroundBlur = false,
      isEditable = false,
      enterKeyHint = 'enter',
      onClickItemExtra,
      onChange,
      borderColor,
      backgroundColor,
      width,
      height,
      disabled,
      customValue,
      isCustom = false,
      onChangeCustomInput,
      isChevronShown = true,
      fontSize,
      fontWeight,
      isRight,
      onScrollBottom,
      CustomDropdownButton,
      ...inputProps
    },
    ref
  ) => {
    const windowSize = useWindowSize();

    // 드롭다운 열림 여부
    const [isOpened, setIsOpened] = useState(false);
    // 내부적으로 관리하는 선택값
    const [innerValue, setInnerValue] = useState<any>(value);
    // 키보드 포커스 인덱스 (상태)
    const [focusedIndex, setFocusedIndex] = useState<number>(0);
    // 최신 focusedIndex를 저장하는 ref (항상 최신값 사용)
    const focusedIndexRef = useRef<number>(focusedIndex);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    const [reverseDirection, setReverseDirection] = useState<boolean>(false);
    // '직접 입력' 모드 여부
    const [isCustomMode, setIsCustomMode] = useState(false);

    // 인풋에 focus되면 열기 처리
    const onFocusInput = useCallback(() => {
      if (items.length > 0) {
        setIsOpened(true);
      }
    }, [items]);

    // -------------------------------
    // 1) items 배열에 "직접 입력" 항목 추가 (isCustom=true일 때)
    // -------------------------------
    const combinedItems = isCustom
      ? [{ value: CUSTOM_VALUE, title: '직접 입력' }, ...items]
      : items;

    // value가 바뀌면 innerValue 갱신
    useEffect(() => {
      setInnerValue(value);
    }, [value]);

    // value나 items가 바뀔 때 open/close 제어 (원하는 로직에 맞게 수정)
    useEffect(() => {
      if (onChange) {
        if (combinedItems.length > 0) setIsOpened(true);
        else setIsOpened(false);
      }
    }, [value, combinedItems, onChange]);

    const onScrollList = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

        // 스크롤이 최하단에 도달했는지 확인
        if (scrollTop + clientHeight >= scrollHeight) {
          onScrollBottom && onScrollBottom();
        }
      }
    };

    /** 드롭다운 열고 닫기 */
    const toggleDropdown = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        setReverseDirection(windowSize.height - event.screenY < 250);
        if (!isOpened && combinedItems.length === 0) return;
        if (!disabled) setIsOpened((prev) => !prev);
      },
      [isOpened, combinedItems, disabled]
    );

    /** 배경 클릭 시 닫기 */
    const onClickBackground = useCallback(() => {
      setIsOpened(false);
    }, []);

    /** 항목 클릭 시 */
    const handleClickItem = useCallback(
      (newValue: any) => {
        if (disabled) return;
        setIsOpened(false);

        // 직접 입력 항목인 경우
        if (newValue === CUSTOM_VALUE) {
          if (onChangeItem) {
            onChangeItem(CUSTOM_VALUE);
          }
          setIsCustomMode(true);
          setTimeout(() => {
            setInnerValue('');
          });
          requestAnimationFrame(() => {
            if (ref && typeof ref !== 'function') {
              ref.current?.focus();
            }
          });
          onClickItemExtra?.();
          return;
        }

        // 일반 항목 선택
        setInnerValue(newValue);
        setIsCustomMode(false);

        const matched = combinedItems.find((item) => newValue === item.value);
        if (matched && onChangeItem) {
          onChangeItem(matched.value);
        }
        onClickItemExtra?.();
      },
      [disabled, combinedItems, onChangeItem, onClickItemExtra, ref]
    );

    /** 입력창 변경 (직접 입력) */
    const handleChangeInput = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        if (isEditable || isCustomMode) {
          const newValue = event.target.value;
          setInnerValue(newValue);
          if (isCustomMode && onChangeCustomInput) {
            onChangeCustomInput(event);
          }
          if (onChange) {
            onChange(event);
          } else if (onChangeItem && !isCustomMode) {
            onChangeItem(newValue);
          }
        }
      },
      [isEditable, isCustomMode, onChangeItem, onChange, onChangeCustomInput]
    );

    /** 키보드 핸들러 */
    const onKeyDownHandler = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpened) return;
        if (event.keyCode === 229) return; // 한글 입력 등 무시
        if (combinedItems.length === 0) return;

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setFocusedIndex((prevIndex) => {
            const newIndex =
              (prevIndex + combinedItems.length - 1) % combinedItems.length;
            focusedIndexRef.current = newIndex;
            return newIndex;
          });
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          setFocusedIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % combinedItems.length;
            focusedIndexRef.current = newIndex;
            return newIndex;
          });
        } else if (event.key === 'Enter') {
          event.preventDefault();
          // 최신 focusedIndex 값을 ref에서 사용
          const index = focusedIndexRef.current;
          if (combinedItems[index]) {
            onChangeItem?.(combinedItems[index].value);
          }
          setIsOpened(false);
        } else if (event.key === 'Escape') {
          setIsOpened(false);
        }
      },
      [isOpened, combinedItems, onChangeItem]
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
      ref,
      scrollRef,
      onScrollList,
      items: combinedItems,
      innerValue,
      customValue,
      isCustomMode,
      focusedIndex,
      onFocusInput,
      isOpened,
      reverseDirection,
      isEditable: isEditable || isCustomMode,
      borderColor,
      width,
      height,
      backgroundColor,
      disabled,
      enterKeyHint,
      isChevronShown,
      ...inputProps,
      onClickDropdown: toggleDropdown,
      onClickItem: handleClickItem,
      onChangeInput: handleChangeInput,
      onKeyDownHandler,
      fontSize,
      fontWeight,
      isRight,
      CustomDropdownButton,
    };

    return (
      <>
        <TransparentBackground
          isOpened={isOpened}
          onClick={onClickBackground}
          blur={backgroundBlur}
          zIndex={50}
        />
        <DropdownView {...propsForView} />
      </>
    );
  }
);

Dropdown.displayName = 'Dropdown';
export default Dropdown;
