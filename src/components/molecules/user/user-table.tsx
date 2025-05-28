import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  setUserOrderBy,
  setUserOrderDirection,
} from '@/redux/reducers/filter/user-filter-reducer';

import UserTableView from '@/components/molecules/user/user-table.view';
import { MEMBER } from '@/constants/member/member-column';
import { ORDER_DIRECTION } from '@/constants/constant';
import { USER } from '@/constants/user/user-column';

export type UserTableProps = {
  onClickUserItem: (userId: string) => void;
  loadUsers: () => Promise<void>;
};

const UserTable = ({ onClickUserItem, loadUsers }: UserTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { userFilter, userOrderBy, userOrderDirection } = useSelector(
    (state: RootState) => state.userFilter
  );

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: MEMBER | USER) => {
    let newOrderBy = id;

    if (newOrderBy !== userOrderBy) {
      dispatch(setUserOrderBy(newOrderBy));
      dispatch(setUserOrderDirection(ORDER_DIRECTION.ASC));
    } else {
      dispatch(
        setUserOrderDirection(
          userOrderDirection === ORDER_DIRECTION.ASC
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
        loadUsers(); // 데이터를 추가로 로드
      }
    }
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [userOrderBy, userOrderDirection, userFilter]);

  const props = {
    onClickHeader,
    onClickUserItem,
    scrollRef,
    onScroll,
  };

  return (
    <>
      <UserTableView {...props} />
    </>
  );
};

export default UserTable;
