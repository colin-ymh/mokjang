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
import { BorderInputProps, TransparentBackground } from '@mokjang/components';
import DropdownView from './dropdown.view';
import { DropdownValueType } from './dropdown-item';
import useWindowSize from '@/hooks/window/window';
import { useI18n } from '../../../../../locales/client';

export type DropdownProps<
  ItemType extends DropdownValueType = DropdownValueType,
> = BorderInputProps & {
  ref?: RefObject<HTMLInputElement>;
  items: ItemType[];
  value: any;
  onChangeItem?: (value: any) => void;

  // 동작 옵션
  isShowTitle?: boolean;
  isEditable?: boolean;
  backgroundBlur?: boolean;

  // 입력/키보드
  enterKeyHint?: string;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClickItemExtra?: (e?: any) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;

  // 스타일
  borderColor?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  chevronColor?: string;
  isChevronShown?: boolean;
  isRight?: boolean;
  fontSize?: number;
  fontWeight?: number;
  listHeight?: number;

  // 커스텀 입력
  isCustom?: boolean;
  customValue?: string;
  onChangeCustomInput?: (e: ChangeEvent<HTMLInputElement>) => void;

  // 무한 스크롤
  onScrollBottom?: () => void;

  // 우측 커스텀 버튼
  CustomDropdownButton?: React.ComponentType<any>;
};

export const CUSTOM_VALUE = 'custom';

const Dropdown = forwardRef<HTMLInputElement, DropdownProps>((props, ref) => {
  const {
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
    chevronColor,
    placeholder,
    listHeight,
    ...inputProps
  } = props;

  const t = useI18n();
  const { height: winH } = useWindowSize();

  // 상태
  const [isOpened, setIsOpened] = useState(false);
  const [innerValue, setInnerValue] = useState<any>(value);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [reverseDirection, setReverseDirection] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // ref
  const focusedIndexRef = useRef(focusedIndex);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef =
    (ref as RefObject<HTMLInputElement>) ||
    useRef<HTMLInputElement | null>(null);

  // 파생값
  const combinedItems = isCustom
    ? [{ value: CUSTOM_VALUE, title: t('custom') }, ...items]
    : items;

  // 외부 value → 내부 동기화
  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  // 커스텀 모드 켜지면 인풋 포커스 & 커서 끝
  useEffect(() => {
    if (!isCustomMode) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    try {
      const len = el.value?.length ?? 0;
      el.setSelectionRange?.(len, len);
    } catch {}
  }, [isCustomMode, inputRef]);

  // 입력창 포커스 시 열기(커스텀 모드에서는 자동 오픈 X)
  const onFocusInput = useCallback(() => {
    if (disabled || isCustomMode) return;
    if (items.length > 0) setIsOpened(true);
  }, [disabled, isCustomMode, items.length]);

  // 무한 스크롤 하단 감지
  const onScrollList = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight) onScrollBottom?.();
  }, [onScrollBottom]);

  // 드롭다운 토글
  const toggleDropdown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      setReverseDirection(winH - e.screenY < 250);
      if (!isOpened) {
        if (combinedItems.length === 0) return;
        setIsOpened(true);
      } else {
        setIsOpened(false);
      }
    },
    [disabled, winH, isOpened, combinedItems.length]
  );

  // 바깥 클릭 닫기
  const onClickBackground = useCallback(() => {
    setIsOpened(false);
  }, []);

  // 항목 클릭
  const handleClickItem = useCallback(
    (newValue: any) => {
      if (disabled) return;

      // 커스텀 모드 진입
      if (newValue === CUSTOM_VALUE) {
        setIsOpened(false);
        setIsCustomMode(true);
        setInnerValue('');
        onChangeItem?.('');
        onClickItemExtra?.();
        return;
      }

      // 일반 선택
      setInnerValue(newValue);
      setIsCustomMode(false);
      setIsOpened(false);

      const matched = combinedItems.find((it) => it.value === newValue);
      if (matched) onChangeItem?.(matched.value);
      onClickItemExtra?.();
    },
    [disabled, combinedItems, onChangeItem, onClickItemExtra]
  );

  // 입력 변경(커스텀/에디터블)
  const handleChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!(isCustomMode || isEditable)) return;

      const newVal = e.target.value;
      setInnerValue(newVal);

      if (isCustomMode) onChangeCustomInput?.(e);
      if (onChange) onChange(e);
      else if (onChangeItem && !isCustomMode) onChangeItem(newVal);
    },
    [isCustomMode, isEditable, onChangeItem, onChange, onChangeCustomInput]
  );

  // 키보드 내비게이션(목록 열렸고 커스텀 모드 아닐 때만)
  const onKeyDownHandler = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isCustomMode || !isOpened || combinedItems.length === 0) return;
      if (e.keyCode === 229) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = (prev + combinedItems.length - 1) % combinedItems.length;
          focusedIndexRef.current = next;
          return next;
        });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = (prev + 1) % combinedItems.length;
          focusedIndexRef.current = next;
          return next;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const idx = focusedIndexRef.current;
        const item = combinedItems[idx];
        if (item) handleClickItem(item.value);
      } else if (e.key === 'Escape') {
        setIsOpened(false);
      }
    },
    [isOpened, combinedItems, handleClickItem, isCustomMode]
  );

  // 전역 키다운 등록(목록 열림 & 커스텀 모드 아님)
  useEffect(() => {
    const listener = (ev: KeyboardEvent) =>
      onKeyDownHandler(ev as unknown as React.KeyboardEvent<HTMLInputElement>);
    if (isOpened && !isCustomMode) window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [isOpened, onKeyDownHandler, isCustomMode]);

  useEffect(() => {
    if (!value || items.length === 0) return;

    const foundIndex = items.findIndex((item) => item.value === value);
    if (foundIndex !== -1) {
      setFocusedIndex(foundIndex);
      focusedIndexRef.current = foundIndex; // 키보드 내비게이션과 동기화
    }
  }, [value, items]);

  // 뷰에 내려줄 props
  const viewProps = {
    ref: inputRef,
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
    chevronColor,
    disabled,
    enterKeyHint,
    isChevronShown,
    placeholder,
    fontSize,
    fontWeight,
    isRight,
    CustomDropdownButton,
    ...inputProps,
    onClickDropdown: toggleDropdown,
    onClickItem: handleClickItem,
    onChangeInput: handleChangeInput,
    listHeight,
    onKeyDownHandler,
  };

  return (
    <>
      <TransparentBackground
        isOpened={isOpened}
        onClick={onClickBackground}
        blur={backgroundBlur}
        zIndex={50}
      />
      <DropdownView {...viewProps} />
    </>
  );
});

Dropdown.displayName = 'Dropdown';
export default Dropdown;
