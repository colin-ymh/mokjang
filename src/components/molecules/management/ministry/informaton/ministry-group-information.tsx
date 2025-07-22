import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLACK, DESTRUCTIVE } from '@/constants/styles/color';
import { Ministry, MinistryGroup } from '@/models/management/management';
import { useScopedI18n } from '../../../../../../locales/client';
import { getFormattedTitle } from '@/utils/format';
import { getIsWellFormedTitle } from '@/utils/check';
import { fetchMinistryGroups } from '@/redux/reducers/church-reducer';
import { BLANK, ORDER_DIRECTION } from '@/constants/constant';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { Member } from '@/models/member/member';
import { MEMBER } from '@/constants/column/member-column';
import MinistryGroupInformationView from '@/components/molecules/management/ministry/informaton/ministry-group-information.view';
import { MinistryGroupsApi } from '@/api/management/ministry/ministry-groups.api';
import {
  MinistriesApi,
  MINISTRY_ORDER,
} from '@/api/management/ministry/ministries.api';
import { MinistryGroupMembersApi } from '@/api/management/ministry/ministry-group-members.api';

type MinistryGroupInformationProps = {
  selectedMinistryGroup: MinistryGroup;
  onClickMinistryGroup: (ministryGroup: MinistryGroup) => void;
};

const MinistryGroupInformation = ({
  selectedMinistryGroup,
  onClickMinistryGroup,
}: MinistryGroupInformationProps) => {
  const t_popup = useScopedI18n('popup');

  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);

  const ministryGroupMembersApi = new MinistryGroupMembersApi(false);
  const ministriesApi = new MinistriesApi(false);
  const ministryGroupsApi = new MinistryGroupsApi(false);

  // 에러 처리
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const [isEditShown, setIsEditShown] = useState<boolean>(false);
  // 수정할 그룹명
  const [editName, setEditName] = useState<string>(BLANK);
  // 새로운 그룹장
  const [newMinistryGroupLeaderId, setNewMinistryGroupLeaderId] =
    useState<string>(selectedMinistryGroup.leaderMemberId);

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

  // 사역 목록
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  // 교인 추가 용으로 선택된 사역
  const [selectedMinistryId, setSelectedMinistryId] = useState<string>(BLANK);

  // 선택된 교인 목록
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  // 그룹에 교인 다중 추가를 위한 모달 활성화 여부
  const [isAddModalShown, setIsAddModalShown] = useState<boolean>(false);

  // (교인 추가 팝업 이벤트) 사역 드롭다운 변경
  const onChangeMinistryItem = (id: string) => {
    setSelectedMinistryId(id);
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

  const onChangeEditMinistryGroupName = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setEditName(getFormattedTitle(event.target.value));
  };

  const onChangeNewMinistryGroupLeaderId = (id: string) => {
    setNewMinistryGroupLeaderId(id);
  };
  const onClickSaveEdit = async () => {
    if (!getIsWellFormedTitle(editName)) {
      return;
    }

    try {
      if (editName !== selectedMinistryGroup.name) {
        await ministryGroupsApi.editMinistryGroupName(
          { churchId, ministryGroupId: selectedMinistryGroup.id as string },
          { name: editName }
        );
      }
      if (newMinistryGroupLeaderId !== selectedMinistryGroup.leaderMemberId) {
        await ministryGroupsApi.editMinistryGroupLeader(
          {
            churchId,
            ministryGroupId: selectedMinistryGroup.id as string,
          },
          { newMinistryGroupLeaderId }
        );
      }
      const response = await ministryGroupsApi.getMinistryGroup({
        churchId,
        ministryGroupId: selectedMinistryGroup.id as string,
      });

      await dispatch(fetchMinistryGroups());
      onClickMinistryGroup(response.data);
      setIsEditShown(false);
      setEditName(BLANK);
      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setIsToastShown(true));
      dispatch(setToastBackgroundColor(BLACK));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.LIGHT));
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
  };

  const fetchMembers = async () => {
    if (isLoading || !selectedMinistryGroup.id) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const response = await ministryGroupMembersApi.getMinistryGroupMembers({
        churchId,
        page,
        take: 30,
        ministryGroupId: selectedMinistryGroup.id as string,
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
  const onClickSaveNewMembers = async (selectedMembers: Member[]) => {
    try {
      if (selectedMembers.length === 0) return;

      await ministryGroupMembersApi.createMemberMinistryGroup(
        { churchId, ministryGroupId: selectedMinistryGroup.id as string },
        {
          members: selectedMembers.map((member) => {
            return {
              memberId: member.id as string,
              ministryId: selectedMinistryId || undefined,
            };
          }),
        }
      );
      dispatch(fetchMinistryGroups());

      // 목록 갱신 후 모달 닫기
      await fetchMembers();

      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setToastBackgroundColor(BLACK));
      dispatch(setIsToastShown(true));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.LIGHT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      setPage(1);
      setTimeout(() => {
        // 목록 갱신 후 모달 닫기
        fetchMembers();
        fetchMinistries();
        setSelectedMembers([]);
        setIsAddModalShown(false);
      });
    }
  };

  const fetchMinistries = async () => {
    if (!selectedMinistryGroup.id) return;

    try {
      const response = await ministriesApi.getMinistries({
        churchId,
        ministryGroupId: selectedMinistryGroup.id as string,
        order: MINISTRY_ORDER.CREATED_AT,
      });

      const newMinistries = response.data.data;

      setMinistries(newMinistries);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
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
      fetchMinistries();
    });
  }, [selectedMinistryGroup.id]);

  useEffect(() => {
    setEditName(selectedMinistryGroup.name);
  }, [selectedMinistryGroup]);

  useEffect(() => {
    if (ministries.length > 0) {
      setSelectedMinistryId(ministries[0].id);
    } else {
      setSelectedMinistryId(BLANK);
    }
  }, [ministries]);

  const props = {
    selectedMinistryGroup,
    isAddModalShown,
    isEditShown,
    editName,
    members,
    selectedMembers,
    setSelectedMembers,
    loadMembers,
    orderBy,
    orderDirection,
    ministries,
    selectedMinistryId,
    onClickHeaderItem,
    onClickMinistryGroup,
    onClickEditOpen,
    onClickEditClose,
    onChangeNewMinistryGroupLeaderId,
    onChangeEditMinistryGroupName,
    onClickSaveEdit,
    onClickAddModalOpen,
    onClickAddModalClose,
    onClickSaveNewMembers,
    fetchMinistries,
    fetchMembers,
    onChangeMinistryItem,
  };

  return (
    <>
      <MinistryGroupInformationView {...props} />
    </>
  );
};

export default MinistryGroupInformation;
