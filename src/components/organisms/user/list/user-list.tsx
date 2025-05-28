import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchUsers,
  setUsers,
} from '@/redux/reducers/filter/user-filter-reducer';

import UserListView from '@/components/organisms/user/list/user-list.view';
import { User } from '@/models/user/user';
import { HEADER_BAR } from '@/constants/constant';

type UserListProps = {
  headerType?: HEADER_BAR;
};

const UserList = ({ headerType = HEADER_BAR.ALL }: UserListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const { users, userFilter, userOrderBy, userOrderDirection } = useSelector(
    (state: RootState) => state.userFilter
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 무한 스크롤로 데이터 추가 로드
  const loadUsers = async () => {
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchUsers({
          churchId,
          currentPage: page + 1,
        })
      );
      if (fetchUsers.fulfilled.match(result)) {
        const newUsers: User[] = result.payload;
        if (newUsers.length > 0) {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(users.map((user) => user.id));
          const filteredNewUsers = newUsers.filter(
            (user) => !existingIds.has(user.id)
          );
          dispatch(setUsers([...users, ...filteredNewUsers]));
          setPage((prev) => prev + 1); // 다음 페이지로 이동
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 정보가 변경될 때, 교인들을 다시 불러오는 부분
  useEffect(() => {
    const fetchInitialUsers = async () => {
      try {
        const result = await dispatch(
          fetchUsers({
            churchId,
            currentPage: 1,
          })
        );
        if (fetchUsers.fulfilled.match(result)) {
          dispatch(setUsers(result.payload));
          setPage(1);
        }
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    fetchInitialUsers();
  }, [churchId, userFilter, userOrderBy, userOrderDirection, headerType]);

  // 목록에서 교인을 선택하여 상세 페이지로 이동
  const onClickUserItem = async (userId: string) => {
    try {
      // const response = await usersApi.getUser({
      //   churchId,
      //   userId,
      // });
      // const user = response.data;
      // dispatch(setTargetUser(user));
      // setIsUserInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const props = {
    list: {
      onClickUserItem,
      loadUsers,
    },
    information: {
      isLoading,
    },
  };

  return (
    <>
      <UserListView {...props} />
    </>
  );
};

export default UserList;
