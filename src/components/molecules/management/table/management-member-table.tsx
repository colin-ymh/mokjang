import React, { useEffect, useRef } from 'react';
import { Member } from '@/models/member/member';
import ManagementMemberTableView from '@/components/molecules/management/table/management-member-table.view';
import { MEMBER } from '@/constants/column/member-column';
import { ORDER_DIRECTION } from '@/constants/constant';
import { TABLE_HEADER_ITEM } from '@/redux/reducers/filter/member-filter-reducer';

export type ManagementMemberTableProps = {
  members: Member[];
  loadMembers: () => void;
  orderBy: MEMBER | null;
  orderDirection: ORDER_DIRECTION | null;
  onClickHeaderItem: (headerId: MEMBER) => void;
  headerItems: TABLE_HEADER_ITEM[];
};

const ManagementMemberTable = ({
  members,
  loadMembers,
  orderBy,
  orderDirection,
  onClickHeaderItem,
  headerItems,
}: ManagementMemberTableProps) => {
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
    members,
    scrollRef,
    onScroll,
    orderBy,
    orderDirection,
    onClickHeaderItem,
    headerItems,
  };

  return (
    <>
      <ManagementMemberTableView {...props} />
    </>
  );
};

export default ManagementMemberTable;
