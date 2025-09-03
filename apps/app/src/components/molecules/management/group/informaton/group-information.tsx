import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLACK, DESTRUCTIVE } from '@mokjang/constants';
import { Group } from '@mokjang/models';
import { useScopedI18n } from '../../../../../../locales/client';
import { getFormattedTitle } from '@mokjang/utils';
import { getIsWellFormedTitle } from '@mokjang/utils';
import { fetchGroups } from '../../../../../redux/reducers/church-reducer';
import { BLANK, ORDER_DIRECTION } from '@mokjang/constants';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '../../../../../redux/reducers/toast-popup-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { Member } from '@mokjang/models';
import { MEMBER } from '@mokjang/constants';
import { GroupMembersApi } from '../../../../../api/management/group/group-membes.api';
import { GroupsApi } from '../../../../../api/management/group/groups.api';
import GroupInformationView from './group-information.view';
import { getDateStringFromDate } from '@mokjang/utils';

type GroupInformationProps = {
  selectedGroup: Group;
  onClickGroup: (group: Group) => void;
};

const GroupInformation = ({
  selectedGroup,
  onClickGroup,
}: GroupInformationProps) => {
  const t_popup = useScopedI18n('popup');

  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);

  const groupMembersApi = new GroupMembersApi(false);
  const groupsApi = new GroupsApi(false);

  // 에러 처리
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const [isEditShown, setIsEditShown] = useState<boolean>(false);
  // 수정할 그룹명
  const [editName, setEditName] = useState<string>(BLANK);
  // 새로운 그룹장
  const [newGroupLeaderId, setNewGroupLeaderId] = useState<string>(
    selectedGroup.leaderMemberId
  );

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 교인 정렬
  const [orderBy, setOrderBy] = useState<MEMBER | null>(null);
  const [orderDirection, setOrderDirection] = useState<ORDER_DIRECTION | null>(
    null
  );

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 그룹에 속한 교인 목록
  const [members, setMembers] = useState<Member[]>([]);

  // 시작 날짜
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  // 선택된 교인 목록
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  // 그룹에 교인 다중 추가를 위한 모달 활성화 여부
  const [isAddModalShown, setIsAddModalShown] = useState<boolean>(false);

  // 시작 날짜 변경
  const onChangeStartDate = (date: Date | null) => {
    setStartDate(date);
  };

  const onClickHeaderItem = (headerId: MEMBER) => {
    if (orderBy === headerId) {
      setOrderDirection(
        orderDirection === ORDER_DIRECTION.ASC
          ? ORDER_DIRECTION.DESC
          : ORDER_DIRECTION.ASC
      );
    } else {
      if (orderDirection === null) {
        setOrderDirection(ORDER_DIRECTION.ASC);
      }
      setOrderBy(headerId);
    }
  };

  const onClickEditOpen = () => {
    setIsEditShown(true);
  };

  const onClickEditClose = () => {
    setIsEditShown(false);
  };

  const onChangeEditGroupName = (event: ChangeEvent<HTMLInputElement>) => {
    setEditName(getFormattedTitle(event.target.value));
  };

  const onChangeNewGroupLeaderId = (id: string) => {
    setNewGroupLeaderId(id);
  };
  const onClickSaveEdit = async () => {
    if (!getIsWellFormedTitle(editName)) {
      return;
    }

    try {
      if (editName !== selectedGroup.name) {
        await groupsApi.editGroupName(
          { churchId, groupId: selectedGroup.id as string },
          { name: editName }
        );
      }
      if (
        newGroupLeaderId &&
        newGroupLeaderId !== selectedGroup.leaderMemberId
      ) {
        await groupsApi.editGroupLeader(
          {
            churchId,
            groupId: selectedGroup.id as string,
          },
          {
            newLeaderMemberId: newGroupLeaderId,
            startDate: getDateStringFromDate(new Date()),
          }
        );
      }
      const response = await groupsApi.getGroup({
        churchId,
        groupId: selectedGroup.id as string,
      });

      await dispatch(fetchGroups());
      onClickGroup(response.data);
      setIsEditShown(false);
      setEditName(BLANK);
      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setIsToastShown(true));
      dispatch(setToastBackgroundColor(BLACK));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  // 교인 추가 모달 열기
  const onClickAddModalOpen = () => {
    setIsAddModalShown(true);
  };

  // 교인 추가 모달 닫기
  const onClickAddModalClose = () => {
    setIsAddModalShown(false);
    setSelectedMembers([]);
    setStartDate(new Date());
  };

  const fetchMembers = async () => {
    if (isLoading || !selectedGroup.id) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const response = await groupMembersApi.getGroupMembers({
        churchId,
        page,
        take: 30,
        groupId: selectedGroup.id as string,
        orderDirection: orderDirection || undefined,
      });

      const newMembers: Member[] = response.data.data;

      if (newMembers.length > 0) {
        // 기존 데이터와 합치면서 중복 제거
        const existingIds = new Set(members.map((member) => member.id));
        const filteredNewMembers = newMembers.filter(
          (member) => !existingIds.has(member.id)
        );
        setMembers([...members, ...filteredNewMembers]);
        setPage((prev) => prev + 1); // 다음 페이지로 이동
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 무한 스크롤로 데이터 추가 로드
  const loadMembers = () => {
    setPage(page + 1);
  };

  // 새로운 그룹원들 추가
  const onClickSaveNewMembers = async (
    selectedMembers: Member[],
    startDate: Date
  ) => {
    try {
      if (selectedMembers.length === 0) return;

      await groupMembersApi.addGroupMember(
        { churchId, groupId: selectedGroup.id as string },
        {
          memberIds: selectedMembers.map((member) => member.id),
          startDate: getDateStringFromDate(startDate),
        }
      );
      dispatch(fetchGroups());

      // 목록 갱신 후 모달 닫기
      await fetchMembers();

      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setToastBackgroundColor(BLACK));
      dispatch(setIsToastShown(true));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      setPage(1);
      setTimeout(() => {
        // 목록 갱신 후 모달 닫기
        fetchMembers();
        setSelectedMembers([]);
        setStartDate(new Date());
        setIsAddModalShown(false);
      });
    }
  };

  // 교인 불러오기
  useEffect(() => {
    fetchMembers();
  }, [page]);

  useEffect(() => {
    setMembers([]);
    setPage(1);
  }, [orderBy, orderDirection]);

  useEffect(() => {
    setMembers([]);
    setPage(1);
    setTimeout(() => {
      fetchMembers();
    });
  }, [selectedGroup.id]);

  useEffect(() => {
    setEditName(selectedGroup.name);
  }, [selectedGroup]);

  const props = {
    selectedGroup,
    isAddModalShown,
    isEditShown,
    editName,
    members,
    selectedMembers,
    setSelectedMembers,
    loadMembers,
    orderBy,
    orderDirection,
    startDate,
    onChangeStartDate,
    onClickHeaderItem,
    onClickGroup,
    onClickEditOpen,
    onClickEditClose,
    onChangeNewGroupLeaderId,
    onChangeEditGroupName,
    onClickSaveEdit,
    onClickAddModalOpen,
    onClickAddModalClose,
    onClickSaveNewMembers,
    fetchMembers,
  };

  return (
    <>
      <GroupInformationView {...props} />
    </>
  );
};

export default GroupInformation;
