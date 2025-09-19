import React, { useEffect, useRef } from 'react';
import { Member } from '@mokjang/models';
import ManagementMemberTableView from './management-member-table.view';
import { MEMBER, ORDER_DIRECTION } from '@mokjang/constants';
import { CHURCH_CONTENT_ID } from '../../../../constants/layout/content';

export type ManagementMemberTableProps = {
  members: Member[];
  loadMembers: () => void;
  orderBy: MEMBER | null;
  orderDirection: ORDER_DIRECTION | null;
  onClickHeaderItem: (headerId: MEMBER) => void;
  type: CHURCH_CONTENT_ID;
  leaderMemberId?: string;
};

const ManagementMemberTable = ({
  members,
  loadMembers,
  orderBy,
  orderDirection,
  onClickHeaderItem,
  type,
  leaderMemberId,
}: ManagementMemberTableProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      // 스크롤이 최하단에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight - 10) {
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
    members,
    scrollRef,
    onScroll,
    orderBy,
    orderDirection,
    onClickHeaderItem,
    type,
    leaderMemberId,
  };

  return (
    <>
      <ManagementMemberTableView {...props} />
    </>
  );
};

export default ManagementMemberTable;
