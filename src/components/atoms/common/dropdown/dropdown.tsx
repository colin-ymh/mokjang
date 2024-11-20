"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import TransparentBackground from "@/components/atoms/common/etc/transparent-background";
import DropdownView from "@/components/atoms/common/dropdown/dropdown.view";
import { DropdownValueType } from "@/components/atoms/common/dropdown/dropdown-item";

export type DropdownProps = {
  items: DropdownValueType[]; // dropdown 선택 가능 요소들
  value: string; // dropdown 에서 선택된 값
  onChange?: (value: any) => void;
  reverseDirection?: boolean;
  isShowTitle?: boolean;
  isEditable?: boolean;
  backgroundBlur?: boolean; // 드롭다운 클릭 배경 흐려짐
};

const Dropdown = ({
  items,
  value,
  onChange,
  reverseDirection = false,
  backgroundBlur = true,
}: DropdownProps) => {
  // 드롭다운 활성화 여부
  const [isOpened, setIsOpened] = useState(false);

  // 드롭다운 내에서 관리하는 value
  const [valueIndex, setValueIndex] = useState<number>(
    items.findIndex((item) => item.value === value),
  );

  // 드롭다운 외부 영역 클릭 시 일어나는 이벤트
  const onClickBackground = () => {
    setIsOpened(false);
  };

  // 드롭다운 영역 클릭 시 일어나는 이벤트
  const onClickDropdown = () => {
    setIsOpened((prev) => !prev);
  };

  // 드롭다운 아이템 선택 시 일어나는 이벤트
  const onClickItem = (index: number) => {
    setIsOpened(false);
    setValueIndex(index);

    if (onChange) {
      const newValue = items.find((_, index) => valueIndex === index);
      onChange(newValue);
    }
  };

  const props = {
    //
    items,
    valueIndex,

    //
    isOpened,
    setIsOpened,
    onClickDropdown,
    onClickItem,

    // style
    reverseDirection,
  };

  return (
    <>
      {/* 빈 공간 터치 시에 드롭다운 off */}
      <TransparentBackground
        isOpened={isOpened}
        onClick={onClickBackground}
        blur={backgroundBlur}
      />

      {/* 드롭다운 렌더링 */}
      <DropdownView {...props} />
    </>
  );
};

export default Dropdown;
