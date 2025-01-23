'use client';

import React, {
  ChangeEvent,
  forwardRef,
  RefObject,
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
      ...inputProps
    },
    ref
  ) => {
    // 드롭다운 활성화 여부
    const [isOpened, setIsOpened] = useState(false);

    // 드롭다운 내에서 관리하는 value (외부 데이터를 직접 수정하지 않도록 관리)
    const [innerValue, setInnerValue] = useState<any>(value);

    // 현재 focus 된 item
    const [focusedIndex, setFocusedIndex] = useState<number>(0);

    useEffect(() => {
      setInnerValue(value);
    }, [value]);

    // 드롭다운 외부 영역 클릭 시 일어나는 이벤트
    const onClickBackground = () => {
      setIsOpened(false);
    };

    // 드롭다운 영역 클릭 시 일어나는 이벤트
    const onClickDropdown = () => {
      if ((!isOpened && items.length === 0) || disabled) return;
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
      if (onChange) {
        // 아이템이 있으면 드롭다운 열기
        if (items.length > 0) setIsOpened(true);
        else setIsOpened(false);
      }
    }, [value, items]);

    const onFocusInput = () => {
      // setIsOpened(true);
    };

    const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode === 229) return;
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusedIndex((focusedIndex + items.length - 1) % items.length);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setFocusedIndex((focusedIndex + 1) % items.length);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (onChangeItem && items[focusedIndex]) {
          onChangeItem(items[focusedIndex].value);
        }
        setIsOpened(false);
      } else if (event.key === 'Escape') {
        setIsOpened(false);
      }
    };

    useEffect(() => {
      if (isOpened) {
        window.addEventListener('keydown', onKeyDownHandler as any);
        return () => {
          window.removeEventListener('keydown', onKeyDownHandler as any);
        };
      }
    }, [isOpened, setIsOpened, focusedIndex]);

    useEffect(() => {
      setFocusedIndex(0);
    }, [items]);

    useEffect(() => {
      const newIndex = items.findIndex((item) => item.value === value);
      setFocusedIndex(newIndex);
    }, [value]);

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
          blur={false}
        />
        {/* 드롭다운 렌더링 */}
        <DropdownView {...props} />
      </>
    );
  }
);

export default Dropdown;
