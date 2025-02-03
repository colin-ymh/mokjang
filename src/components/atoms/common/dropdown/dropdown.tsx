'use client';

import React, {
  ChangeEvent,
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';
import TransparentBackground from '@/components/atoms/common/etc/transparent-background';
import DropdownView from '@/components/atoms/common/dropdown/dropdown.view';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { InputProps } from '@/components/atoms/common/input/main-input';

export type DropdownProps<
  ItemType extends DropdownValueType = DropdownValueType,
> = InputProps & {
  ref?: RefObject<HTMLInputElement>;
  items: ItemType[]; // dropdown 선택 가능 요소들
  value: any; // dropdown에서 선택된 값
  onChangeItem?: (value: any) => void;

  // 동작 관련 옵션
  isShowTitle?: boolean;
  isEditable?: boolean;
  reverseDirection?: boolean;
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
};

export const CUSTOM_VALUE = 'custom';

const Dropdown = forwardRef<HTMLInputElement, DropdownProps>(
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
      customValue,
      isCustom = false,
      onChangeCustomInput,
      ...inputProps
    },
    ref
  ) => {
    // 드롭다운 열림 여부
    const [isOpened, setIsOpened] = useState(false);
    // 내부적으로 관리하는 선택값
    const [innerValue, setInnerValue] = useState<any>(value);
    // 키보드 포커스 인덱스
    const [focusedIndex, setFocusedIndex] = useState<number>(0);
    // '직접 입력' 모드 여부
    const [isCustomMode, setIsCustomMode] = useState(false);

    // 인풋에 focus되면 setIsOpened(true)로 열기
    const onFocusInput = useCallback(() => {
      if (items.length > 0) {
        setIsOpened(true);
      }
    }, [items]);

    // --------------------------------
    // 1) items 배열에 "직접 입력" 항목 추가 (isCustom=true일 때)
    // --------------------------------
    const combinedItems = isCustom
      ? [{ value: CUSTOM_VALUE, title: '직접 입력' }, ...items]
      : items;

    // value가 바뀌면 innerValue 갱신
    useEffect(() => {
      setInnerValue(value);
    }, [value]);

    // 항목 업데이트 시 포커스 인덱스 초기화
    // useEffect(() => {
    //   // setFocusedIndex(0);
    // }, [combinedItems]);

    // value가 바뀌거나 items가 바뀔 때 open/close를 제어
    useEffect(() => {
      if (onChange) {
        // items가 생기면 열어주고, 없으면 닫기
        if (combinedItems.length > 0) setIsOpened(true);
        else setIsOpened(false);
      }
    }, [value, combinedItems, onChange]);

    // 현재 value가 변경되면, 해당 값의 인덱스로 focusedIndex 조정
    // useEffect(() => {
    //   const newIndex = combinedItems.findIndex((item) => item.value === value);
    //   // setFocusedIndex(newIndex);
    // }, [value, combinedItems]);

    // useEffect(() => {
    //   if (isCustomMode) {
    //     // 예: combinedItems[0]이 직접입력인 경우 그냥 0으로 고정
    //     // 만약 '직접 입력' 항목이 다른 위치라면 findIndex로 찾으면 됨
    //     setFocusedIndex(0);
    //   }
    // }, [isCustomMode]);

    /** 드롭다운 열고 닫기 */
    const toggleDropdown = useCallback(() => {
      if (!isOpened && combinedItems.length === 0) return;
      if (!disabled) setIsOpened((prev) => !prev);
    }, [isOpened, combinedItems, disabled]);

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
          // 직접 입력을 선택했을 때도 onChangeItem으로 CUSTOM_VALUE 넘기기
          if (onChangeItem) {
            onChangeItem(CUSTOM_VALUE);
          }

          // 입력란을 빈칸으로 하고, 직접 입력 모드로 전환
          setIsCustomMode(true);
          // setFocusedIndex(0);
          setTimeout(() => {
            setInnerValue('');
          });

          // 드롭다운 닫히고 난 뒤에 input에 포커스
          requestAnimationFrame(() => {
            if (ref && typeof ref !== 'function') {
              ref.current?.focus();
            }
          });

          onClickItemExtra?.();
          return;
        }

        // 일반 항목
        setInnerValue(newValue);
        setIsCustomMode(false);

        // 외부로 항목 값을 전달
        const matched = combinedItems.find((item) => newValue === item.value);
        if (matched && onChangeItem) {
          onChangeItem(matched.value);
        }
        onClickItemExtra?.();
      },
      [disabled, combinedItems, onChangeItem, onClickItemExtra]
    );

    /** 입력창이 변경될 때 */
    const handleChangeInput = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        // 기본 isEditable OR 커스텀 모드인 경우에만 입력 처리
        if (isEditable || isCustomMode) {
          const newValue = event.target.value;
          setInnerValue(newValue);

          // 만약 커스텀 모드라면, onChangeCustomInput 우선 호출
          if (isCustomMode && onChangeCustomInput) {
            onChangeCustomInput(event);
          }

          // 기존 onChange
          if (onChange) {
            onChange(event);
          } else if (onChangeItem && !isCustomMode) {
            // 일반 editable일 때
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

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setFocusedIndex(
            (focusedIndex + combinedItems.length - 1) % combinedItems.length
          );
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          setFocusedIndex((focusedIndex + 1) % combinedItems.length);
        } else if (event.key === 'Enter') {
          event.preventDefault();
          if (combinedItems[focusedIndex]) {
            handleClickItem(combinedItems[focusedIndex].value);
          }
        } else if (event.key === 'Escape') {
          setIsOpened(false);
        }
      },
      [isOpened, focusedIndex, combinedItems, handleClickItem]
    );

    useEffect(() => {
      const listener = (e: KeyboardEvent) =>
        onKeyDownHandler(e as unknown as React.KeyboardEvent<HTMLInputElement>);

      // isOpened가 true이면 리스너 등록
      if (isOpened) {
        window.addEventListener('keydown', listener);
      }

      // 항상(언마운트나 deps가 바뀔 때) 실행되는 정리 단계
      return () => {
        window.removeEventListener('keydown', listener);
      };
    }, [isOpened, combinedItems]);

    const propsForView = {
      ref,
      items: combinedItems,
      innerValue,
      customValue,
      isCustomMode,
      focusedIndex,
      onFocusInput,
      isOpened,
      reverseDirection,
      // 만약 "직접 입력" 모드면 isEditable 강제 true
      isEditable: isEditable || isCustomMode,
      borderColor,
      width,
      height,
      backgroundColor,
      disabled,
      enterKeyHint,
      ...inputProps,
      // 이벤트 핸들러들
      onClickDropdown: toggleDropdown,
      onClickItem: handleClickItem,
      onChangeInput: handleChangeInput,
      onKeyDownHandler,
    };

    return (
      <>
        {/** 빈 영역 터치 시 닫기 */}
        <TransparentBackground
          isOpened={isOpened}
          onClick={onClickBackground}
          blur={backgroundBlur}
        />
        {/** 실제 드롭다운 뷰 */}
        <DropdownView {...propsForView} />
      </>
    );
  }
);

Dropdown.displayName = 'Dropdown';
export default Dropdown;
