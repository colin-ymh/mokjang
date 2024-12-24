import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setMemberTableHeaderItemList } from "@/redux/reducers/member-filter-reducer";

import TableSettingView from "@/components/molecules/member/list/table-setting.view";
import DropdownItem, {
  DropdownValueType,
} from "@/components/atoms/common/dropdown/dropdown-item";
import { getTranslatedMemberColumn } from "@/utils/translate";
import { MEMBER } from "@/constants/member/member-column";
import { NULL } from "@/constants/constant";
import { useI18n } from "../../../../../locales/client";

type AddFilterProps = {
  setIsShown: Dispatch<SetStateAction<boolean>>;
};

const TableSetting = ({ setIsShown }: AddFilterProps) => {
  const memberTableHeaderItemList = useSelector(
    (state: RootState) => state.memberFilter.memberTableHeaderItemList,
  );
  const dispatch = useDispatch<AppDispatch>();
  const t = useI18n();

  // 필터 가능 항목
  const [filterDropdownItems, setFilterDropdownItems] = useState<
    DropdownValueType[]
  >([]);

  const DEFAULT_FILTER_ITEM = { value: NULL, title: "필터 추가하기" };

  const [filterValue, setFilterValue] = useState<MEMBER | typeof NULL>(NULL);

  // 칼럼들을 드래그하여 순서 변경
  const onDragItem = (fromIndex: number, toIndex: number) => {
    const updatedHeaders = [...memberTableHeaderItemList];
    const [movedItem] = updatedHeaders.splice(fromIndex, 1);
    updatedHeaders.splice(toIndex, 0, movedItem);

    dispatch(setMemberTableHeaderItemList(updatedHeaders));
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

  const props = {
    filterValue,
    filterDropdownItems,
    onDragItem,
  };

  return (
    <>
      <TableSettingView {...props} />
    </>
  );
};

export default TableSetting;
