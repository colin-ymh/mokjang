import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  setMemberOrderBy,
  setMemberOrderDirection,
} from "@/redux/reducers/member-filter-reducer";

import { Member } from "@/models/member/member";
import { MEMBER } from "@/constants/member/member-column";
import { ORDER_DIRECTION } from "@/constants/constant";
import MemberTableView from "@/components/molecules/member/member-table.view";

type MemberTableProps = {
  members: Member[];
  onClickMemberItem: (member: Member) => void;
};

const MemberTable = ({ members, onClickMemberItem }: MemberTableProps) => {
  const { memberOrderBy, memberOrderDirection } = useSelector(
    (state: RootState) => state.memberFilter,
  );
  const dispatch = useDispatch<AppDispatch>();

  const onClickHeader = (id: MEMBER) => {
    if (id !== memberOrderBy) {
      dispatch(setMemberOrderBy(id));
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
    onClickMemberItem,
    onClickHeader,
  };

  return (
    <>
      <MemberTableView {...props} />
    </>
  );
};

export default MemberTable;
