import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchChurchUsers,
  setChurchUsers,
} from '@/redux/reducers/filter/church-user-filter-reducer';
import {
  ChurchUser,
  DEFAULT_CHURCH_USER,
} from '@/models/church-user/church-user';
import ChurchUserListView from '@/components/organisms/church-user/list/church-user-list.view';
import { ChurchUsersApi } from '@/api/church-users/church-users.api';
import { setTargetChurchUser } from '@/redux/reducers/target/target-church-user-reducer';
import { ManagersApi } from '@/api/managers/managers.api';

type UserListProps = {
  isManager?: boolean;
};

const ChurchUserList = ({ isManager = false }: UserListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const {
    churchUsers,
    churchUserFilter,
    churchUserOrderBy,
    churchUserOrderDirection,
  } = useSelector((state: RootState) => state.churchUserFilter);

  const { targetChurchUser } = useSelector(
    (state: RootState) => state.targetChurchUser
  );

  const churchUsersApi = new ChurchUsersApi(false);
  const managersApi = new ManagersApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 상세 정보 on off
  const [isChurchUserInformationShown, setIsChurchUserInformationShown] =
    useState<boolean>(false);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  // 무한 스크롤로 데이터 추가 로드
  const loadUsers = async () => {
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchChurchUsers({
          currentPage: page + 1,
          isManager,
        })
      );
      if (fetchChurchUsers.fulfilled.match(result)) {
        const newChurchUsers: ChurchUser[] = result.payload;
        if (newChurchUsers.length > 0) {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(
            churchUsers.map((churchUser) => churchUser.id)
          );
          const filteredNewUsers = newChurchUsers.filter(
            (churchUser) => !existingIds.has(churchUser.id)
          );
          dispatch(setChurchUsers([...churchUsers, ...filteredNewUsers]));
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
          fetchChurchUsers({
            currentPage: 1,
            isManager,
          })
        );
        if (fetchChurchUsers.fulfilled.match(result)) {
          dispatch(setChurchUsers(result.payload));
          setPage(1);
        }
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    fetchInitialUsers();
  }, [churchId, churchUserFilter, churchUserOrderBy, churchUserOrderDirection]);

  // 목록에서 교인을 선택하여 상세 페이지로 이동
  const onClickUserItem = async (user: ChurchUser) => {
    try {
      const request = isManager
        ? managersApi.getManager
        : churchUsersApi.getChurchUser;
      const response = await request({
        churchId,
        churchUserId: user.id,
      });

      const churchUser = response.data.data;
      dispatch(setTargetChurchUser(churchUser));
      setIsChurchUserInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 닫기
  const onClickCloseInformation = () => {
    setIsChurchUserInformationShown(false);
    dispatch(setTargetChurchUser(DEFAULT_CHURCH_USER));
  };

  // 회원 / 관리자 삭제 => 교회 추방
  const onClickDelete = async () => {
    try {
      const response = await churchUsersApi.leaveChurch({
        churchId,
        churchUserId: targetChurchUser.id,
      });
      if (response.status === 200) {
        // 초기화 후 다시 로드
        setPage(1);
        const result = await dispatch(
          fetchChurchUsers({
            currentPage: 1,
            isManager,
          })
        );
        if (fetchChurchUsers.fulfilled.match(result)) {
          dispatch(setChurchUsers(result.payload));
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetChurchUser(DEFAULT_CHURCH_USER));
      setIsChurchUserInformationShown(false);
    }
  };

  const props = {
    list: {
      loadUsers,
      onClickUserItem,
    },
    information: {
      isManager,
      isLoading,
      isChurchUserInformationShown,
      isPopupShown,
      onClickCloseInformation,
      onClickConfirmOpen,
      onClickConfirmClose,
      onClickDelete,
    },
  };

  return (
    <>
      <ChurchUserListView {...props} />
    </>
  );
};

export default ChurchUserList;
