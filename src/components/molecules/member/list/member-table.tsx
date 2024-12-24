import React from "react";
import { Member } from "@/models/member/member";
import MemberTableView from "@/components/molecules/member/list/member-table.view";
import { MEMBER } from "@/constants/member/member-column";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  setMemberOrderBy,
  setMemberOrderDirection,
} from "@/redux/reducers/member-filter-reducer";
import { ORDER_DIRECTION } from "@/constants/constant";

export type MemberTableProps = {
  members: Member[];
  page: number;
  onClickMemberItem: (memberId: string) => void;
  onClickNextPage: () => void;
  onClickPrevPage: () => void;
};

const MemberTable = ({
  members,
  page,
  onClickMemberItem,
  onClickPrevPage,
  onClickNextPage,
}: MemberTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { memberOrderBy, memberOrderDirection } = useSelector(
    (state: RootState) => state.memberFilter,
  );

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: MEMBER) => {
    let newOrderBy = id;

    if (newOrderBy !== memberOrderBy) {
      dispatch(setMemberOrderBy(newOrderBy));
      dispatch(setMemberOrderDirection(ORDER_DIRECTION.ASC));
    } else {
      dispatch(
        setMemberOrderDirection(
          memberOrderDirection === ORDER_DIRECTION.ASC
            ? ORDER_DIRECTION.DESC
            : ORDER_DIRECTION.ASC,
        ),
      );
    }
  };

  const props = {
    members,
    page,
    onClickHeader,
    onClickMemberItem,
    onClickPrevPage,
    onClickNextPage,
  };

  return (
    <>
      <MemberTableView {...props} />
    </>
  );
};

export default MemberTable;
