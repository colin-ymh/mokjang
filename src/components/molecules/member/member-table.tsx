import React from "react";
import { Member } from "@/models/member/member";
import MemberTableView from "@/components/molecules/member/member-table.view";

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
  // const onClickHeader = (id: MEMBER) => {
  //   if (id !== memberOrderBy) {
  //     dispatch(setMemberOrderBy(id));
  //     dispatch(setMemberOrderDirection(ORDER_DIRECTION.ASC));
  //   } else {
  //     dispatch(
  //       setMemberOrderDirection(
  //         memberOrderDirection === ORDER_DIRECTION.ASC
  //           ? ORDER_DIRECTION.DESC
  //           : ORDER_DIRECTION.ASC,
  //       ),
  //     );
  //   }
  // };

  const props = {
    members,
    page,
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
