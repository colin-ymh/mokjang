import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  MEMBER_TABLE_HEADER_ITEM,
  setMemberFilter,
  setMemberTableHeaderItemList,
} from '@/redux/reducers/filter/member-filter-reducer';

import { MEMBER } from '@/constants/column/member-column';
import TableHeaderSettingItemView from '@/components/atoms/member/setting/table-header-setting-item.view';

type TableHeaderSettingItemProps = {
  item: MEMBER_TABLE_HEADER_ITEM;
  index: number;
  onDrop: (fromIndex: number, toIndex: number) => void;
};

const TableHeaderSettingItem = ({
  item,
  index,
  onDrop,
}: TableHeaderSettingItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { memberTableHeaderItemList, memberFilter } = useSelector(
    (state: RootState) => state.memberFilter
  );

  /** 토글 버튼 클릭 시, 컬럼 활성화/비활성 처리 */
  const onClickHeaderItem = (id: MEMBER) => {
    const newHeaderItemList = memberTableHeaderItemList.map((header) =>
      header.id === id ? { ...header, isShown: !header.isShown } : header
    );

    dispatch(setMemberTableHeaderItemList(newHeaderItemList));

    dispatch(
      setMemberFilter({
        ...memberFilter,
        displayColumns: newHeaderItemList
          .filter((item) => item.isShown)
          .map((item) => item.id),
      })
    );
  };

  const props = {
    item,
    index,
    onDrop,
    onClickHeaderItem,
  };

  return (
    <>
      <TableHeaderSettingItemView {...props} />
    </>
  );
};

export default TableHeaderSettingItem;
