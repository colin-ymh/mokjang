import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  INITIAL_MEMBER_FILTER,
  INITIAL_TABLE_HEADER_LIST,
  setMemberFilter,
  setMemberTableHeaderItemList,
} from "@/redux/reducers/member-filter-reducer";

import TableSettingView from "@/components/molecules/member/list/table-setting.view";
import { DropdownValueType } from "@/components/atoms/common/dropdown/dropdown-item";
import { getTranslatedMemberColumn } from "@/utils/translate";
import { MEMBER } from "@/constants/member/member-column";
import { NULL } from "@/constants/constant";

import { useI18n } from "../../../../../locales/client";

type AddFilterProps = {
  setIsShown: Dispatch<SetStateAction<boolean>>;
};

const TableSetting = ({ setIsShown }: AddFilterProps) => {
  const { memberTableHeaderItemList, memberFilter } = useSelector(
    (state: RootState) => state.memberFilter,
  );
  const dispatch = useDispatch<AppDispatch>();
  const t = useI18n();

  // 필터 가능 항목
  const [filterDropdownItems, setFilterDropdownItems] = useState<
    DropdownValueType[]
  >([]);

  const DEFAULT_FILTER_ITEM = { value: NULL, title: "필터 추가하기" };

  // 필터 수정을 위해 선택된 항목
  const [filterValue, setFilterValue] = useState<MEMBER | typeof NULL>(NULL);
  const [filterItems, setFilterItems] = useState<string[]>([]);

  // 칼럼들을 드래그하여 순서 변경
  const onDragItem = (fromIndex: number, toIndex: number) => {
    const updatedHeaders = [...memberTableHeaderItemList];
    const [movedItem] = updatedHeaders.splice(fromIndex, 1);
    updatedHeaders.splice(toIndex, 0, movedItem);

    dispatch(setMemberTableHeaderItemList(updatedHeaders));
  };

  // 드롭다운 아이템을 선택 시 이벤트
  const onChangeFilter = (id: MEMBER | typeof NULL) => {
    setFilterValue(id);

    // 해당 드롭다운에 대한 필터값들 설정
    if (id !== NULL) {
      setFilterItems(
        memberFilter[
          id as
            | MEMBER.GENDER
            | MEMBER.GROUP
            | MEMBER.MINISTRY
            | MEMBER.OFFICER
            | MEMBER.EDUCATION
        ],
      );
    }
  };

  // 현재 보여지는 헤더 중 필터 가능한 항목들을 추려 드롭다운 아이템으로 변환
  useEffect(() => {
    const newFilterDropdownItems = memberTableHeaderItemList
      .filter((item) => item.isShown && item.isFilterable)
      .map((item) => {
        return { value: item.id, title: getTranslatedMemberColumn(t, item.id) };
      });

    setFilterDropdownItems([...newFilterDropdownItems, DEFAULT_FILTER_ITEM]);
  }, [memberTableHeaderItemList]);

  // 필터 아이템 체크버튼 이벤트
  const onClickFilterItem = (itemId: string) => {
    // 이전 선택 여부
    const isSelected = filterItems?.includes(itemId);

    let newItems;

    if (isSelected) {
      // 이미 선택된 상태였으면
      // 지우기
      newItems = filterItems.filter((prev) => prev !== itemId);
    } else {
      // 선택이 안된 상태였으면
      // 새로 추가하기
      newItems = [...filterItems, itemId];
    }

    setFilterItems(newItems);
  };

  useEffect(() => {
    // 필터 내용이 변경되면
    // memberFilter 를 수정하여 서버에 재요청
    dispatch(setMemberFilter({ ...memberFilter, [filterValue]: filterItems }));
  }, [filterItems]);

  const onClickCancel = () => {
    setIsShown(false);
  };

  const onClickReset = () => {
    dispatch(setMemberFilter(INITIAL_MEMBER_FILTER));
    dispatch(setMemberTableHeaderItemList(INITIAL_TABLE_HEADER_LIST));
    setFilterValue(NULL);
    setFilterItems([]);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsShown(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [setIsShown]);

  const props = {
    filterValue,
    filterItems,
    filterDropdownItems,
    onDragItem,
    onChangeFilter,
    onClickFilterItem,
    onClickCancel,
    onClickReset,
  };

  return (
    <>
      <TableSettingView {...props} />
    </>
  );
};

export default TableSetting;
