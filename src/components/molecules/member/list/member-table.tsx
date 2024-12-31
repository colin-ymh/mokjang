import React, { useEffect, useRef } from "react";
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
  onClickMemberItem: (memberId: string) => void;
  loadMembers: () => Promise<void>;
};

const MemberTable = ({ onClickMemberItem, loadMembers }: MemberTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { members, memberFilter, memberOrderBy, memberOrderDirection } =
    useSelector((state: RootState) => state.memberFilter);

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

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      // 스크롤이 최하단에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight) {
        loadMembers(); // 데이터를 추가로 로드
      }
    }
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [memberOrderBy, memberOrderDirection, memberFilter]);

  const props = {
    members,
    onClickHeader,
    onClickMemberItem,
    scrollRef,
    onScroll,
  };

  return (
    <>
      <MemberTableView {...props} />
    </>
  );
};

export default MemberTable;
