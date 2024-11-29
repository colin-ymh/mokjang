"use client";

import React, {
  ChangeEvent,
  FocusEventHandler,
  forwardRef,
  RefObject,
  useState,
} from "react";
import TransparentBackground from "@/components/atoms/common/etc/transparent-background";
import DropdownView from "@/components/atoms/common/dropdown/dropdown.view";
import { DropdownValueType } from "@/components/atoms/common/dropdown/dropdown-item";
import { InputProps } from "@/components/atoms/common/input/border-input";

export type DropdownProps = {
  items: DropdownValueType[]; // dropdown 선택 가능 요소들
  value: string; // dropdown 에서 선택된 값
  onChangeItem?: (value: any) => void;
  reverseDirection?: boolean;
  isShowTitle?: boolean;
  isEditable?: boolean;
  backgroundBlur?: boolean; // 드롭다운 클릭 배경 흐려짐
  enterKeyHint?: string;
  ref?: RefObject<HTMLDivElement>;
  placeholder?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClickItemExtra?: () => void;
};

const Dropdown = forwardRef<HTMLInputElement, DropdownProps & InputProps>(
  (
    {
      items,
      value,
      onChangeItem,
      backgroundBlur = true,
      reverseDirection = false,
      isEditable = false,
      enterKeyHint = "enter",
      onClickItemExtra,
      ...inputProps
    },
    ref,
  ) => {
    // 드롭다운 활성화 여부
    const [isOpened, setIsOpened] = useState(false);

    // 드롭다운 내에서 관리하는 value (외부 데이터를 직접 수정하지 않도록 관리)
    const [innerValue, setInnerValue] = useState<any>(value);

    // 드롭다운 외부 영역 클릭 시 일어나는 이벤트
    const onClickBackground = () => {
      setIsOpened(false);
    };

    // 드롭다운 영역 클릭 시 일어나는 이벤트
    const onClickDropdown = () => {
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
        // 외부에서 onChangeItem 을 넘겨줬었다면
        if (onChangeItem) {
          // 외부에 해당 value 전달
          onChangeItem(newValue);
        }
      }
    };

    const onFocusInput = () => {
      setIsOpened(true);
    };

    const onPressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode === 229) return;
      // 엔터키 입력 시
      if (event.key === "Enter") {
        setIsOpened(false);
      }
    };

    const props = {
      ref,
      //
      items,
      innerValue,

      //
      isOpened,
      onClickDropdown,
      onClickItem,
      onChangeInput,
      onPressEnter,
      onFocusInput,
      enterKeyHint,

      // style
      reverseDirection,
      isEditable,

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
        <DropdownView {...props} />
      </>
    );
  },
);

export default Dropdown;
