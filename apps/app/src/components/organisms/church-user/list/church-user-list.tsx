'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import {
  fetchChurchUsers,
  setChurchUserFilter,
  setChurchUserPage,
  setChurchUsers,
} from '../../../../redux/reducers/filter/church-user-filter-reducer';
import {
  ChurchUser,
  DEFAULT_CHURCH_USER,
  NOTIFICATION_DOMAIN,
} from '@mokjang/models';
import ChurchUserListView, { UserListViewProps } from './church-user-list.view';
import { ChurchUsersApi } from '../../../../api/church-users/church-users.api';
import { ManagersApi } from '../../../../api/managers/managers.api';
import { CHURCH_USER, DESTRUCTIVE, STATUS } from '@mokjang/constants';
import { closeModal } from '@/redux/reducers/modal-reducer';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { setTargetChurchUser } from '@/redux/reducers/target/target-church-user-reducer';

type UserListProps = {
  isManager?: boolean;
};

const ChurchUserList = ({ isManager = false }: UserListProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const churchId = useSelector((state: RootState) => state.church.churchId);
  const {
    churchUsers,
    churchUserFilter,
    churchUserOrderBy,
    churchUserOrderDirection,
    page,
  } = useSelector((state: RootState) => state.churchUserFilter);
  const modal = useSelector((state: RootState) => state.modal);
  const { targetChurchUser } = useSelector(
    (state: RootState) => state.targetChurchUser
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChurchUserInformationShown, setIsChurchUserInformationShown] =
    useState(false);

  const churchUsersApi = new ChurchUsersApi(false);
  const managersApi = new ManagersApi(false);

  if (thrownError) throw thrownError;

  // 무한 스크롤로 사용자 로드
  const loadUsers = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchChurchUsers({ currentPage: page + 1, isManager })
      );

      if (fetchChurchUsers.fulfilled.match(result)) {
        const newUsers: ChurchUser[] = result.payload;
        const existingIds = new Set(churchUsers.map((u) => u.id));
        const filteredNewUsers = newUsers.filter((u) => !existingIds.has(u.id));

        dispatch(setChurchUsers([...churchUsers, ...filteredNewUsers]));
        dispatch(setChurchUserPage(page + 1));
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      dispatch(setToastText(msg));
      dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
      dispatch(setIsToastShown(true));
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 변경 시 첫 페이지 데이터 로드
  useEffect(() => {
    const fetchInitialUsers = async () => {
      try {
        const result = await dispatch(
          fetchChurchUsers({ currentPage: 1, isManager })
        );
        if (fetchChurchUsers.fulfilled.match(result)) {
          dispatch(setChurchUsers(result.payload));
          dispatch(setChurchUserPage(1));
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        dispatch(setToastText(msg));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      }
    };

    fetchInitialUsers();
  }, [
    churchId,
    churchUserFilter,
    churchUserOrderBy,
    churchUserOrderDirection,
    isManager,
  ]);

  const onClickUserItem = async (user: ChurchUser) => {
    try {
      const response = await (isManager
        ? managersApi.getManager({ churchId, churchUserId: user.id })
        : churchUsersApi.getChurchUser({ churchId, churchUserId: user.id }));

      dispatch(setTargetChurchUser(response.data.data));
      setIsChurchUserInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onClickCloseInformation = () => {
    setIsChurchUserInformationShown(false);
    dispatch(setTargetChurchUser(DEFAULT_CHURCH_USER));
    dispatch(closeModal());
  };

  const onClickDelete = async () => {
    try {
      const response = await churchUsersApi.leaveChurch({
        churchId,
        churchUserId: targetChurchUser.id,
      });

      if (response.status === 200) {
        dispatch(setChurchUserPage(1));
        const result = await dispatch(
          fetchChurchUsers({ currentPage: 1, isManager })
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

  // 알림 클릭 시 상세 패널 열기
  useEffect(() => {
    if (!modal.open || modal.type !== NOTIFICATION_DOMAIN.MANAGER || !modal.id)
      return;

    (async () => {
      try {
        const res = await managersApi.getManager({
          churchId,
          churchUserId: modal.id as string,
        });
        dispatch(setTargetChurchUser(res.data.data));
        setIsChurchUserInformationShown(true);
        dispatch(closeModal());
      } catch (error) {
        dispatch(closeModal());
        const msg = error instanceof Error ? error.message : String(error);
        dispatch(setToastText(msg));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      }
    })();
  }, [modal.open, modal.type, modal.id, churchId]);

  const onChangePermissionActive = (
    value?: STATUS.ACTIVE | STATUS.INACTIVE
  ) => {
    dispatch(
      setChurchUserFilter({
        ...churchUserFilter,
        [CHURCH_USER.PERMISSION_ACTIVE]: value
          ? value === STATUS.ACTIVE
          : undefined,
      })
    );
  };

  const props: UserListViewProps = {
    row: {
      onChangePermissionActive,
    },
    list: {
      loadUsers,
      onClickUserItem,
    },
    information: {
      isManager,
      isLoading,
      isChurchUserInformationShown,
      onClickCloseInformation,
      onClickDelete,
    },
  };

  return <ChurchUserListView {...props} />;
};

export default ChurchUserList;
