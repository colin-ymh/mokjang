import React, { useEffect, useRef } from 'react';
import { Member } from '@/models/member/member';
import GroupMemberTableView from '@/components/molecules/management/group/group-member-table.view';

export type GroupMemberTableProps = {
  groupMembers: Member[];
  loadMembers: () => void;
};

const GroupMemberTable = ({
  groupMembers,
  loadMembers,
}: GroupMemberTableProps) => {
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
  }, []);

  const props = {
    groupMembers,
    scrollRef,
    onScroll,
  };

  return (
    <>
      <GroupMemberTableView {...props} />
    </>
  );
};

export default GroupMemberTable;
