import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import {
  setMemberSortBy,
  setMemberSortDirection,
} from '../../../../redux/reducers/filter/member-filter-reducer';

import MemberTableView from './member-table.view';
import { MEMBER } from '@mokjang/constants';
import { ORDER_DIRECTION } from '@mokjang/constants';

export type MemberTableProps = {
  onClickMemberItem: (memberId: string) => void;
  loadMembers: () => Promise<void>;
};

const MemberTable = ({ onClickMemberItem, loadMembers }: MemberTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { members, memberFilter, memberSortBy, memberSortDirection } =
    useSelector((state: RootState) => state.memberFilter);

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: MEMBER) => {
    let newSortBy = id;

    if (newSortBy !== memberSortBy) {
      dispatch(setMemberSortBy(newSortBy));
      dispatch(setMemberSortDirection(ORDER_DIRECTION.ASC));
    } else {
      dispatch(
        setMemberSortDirection(
          memberSortDirection === ORDER_DIRECTION.ASC
            ? ORDER_DIRECTION.DESC
            : ORDER_DIRECTION.ASC
        )
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
  }, [memberSortBy, memberSortDirection, memberFilter]);

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
