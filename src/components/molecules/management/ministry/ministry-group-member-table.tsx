import React, { useEffect, useRef } from 'react';

import { MEMBER } from '@/constants/member/member-column';
import { Member } from '@/models/member/member';
import MinistryGroupMemberTableView from '@/components/molecules/management/ministry/ministry-group-member-table.view';

export type MinistryGroupMemberTableProps = {
  ministryGroupMembers: Member[];
  // onClickMemberItem: (memberId: string) => void;
  // loadMembers: () => Promise<void>;
};

const MinistryGroupMemberTable = ({
  ministryGroupMembers,
  // onClickMemberItem,
  // loadMembers,
}: MinistryGroupMemberTableProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: MEMBER) => {};

  const onScroll = () => {
    // if (scrollRef.current) {
    //   const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    //
    //   // 스크롤이 최하단에 도달했는지 확인
    //   if (scrollTop + clientHeight >= scrollHeight) {
    //     loadMembers(); // 데이터를 추가로 로드
    //   }
    // }
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  const props = {
    ministryGroupMembers,
    onClickHeader,
    // onClickMemberItem,
    scrollRef,
    onScroll,
  };

  return (
    <>
      <MinistryGroupMemberTableView {...props} />
    </>
  );
};

export default MinistryGroupMemberTable;
