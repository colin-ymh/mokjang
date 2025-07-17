import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLACK, DESTRUCTIVE } from '@/constants/styles/color';
import { Officer } from '@/models/management/management';
import { useScopedI18n } from '../../../../../../locales/client';
import { getFormattedTitle } from '@/utils/format';
import { getIsWellFormedTitle } from '@/utils/check';
import { fetchOfficers } from '@/redux/reducers/church-reducer';
import { BLANK, ORDER_DIRECTION } from '@/constants/constant';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { OfficersApi } from '@/api/management/officer/officers.api';
import { MembersApi } from '@/api/members/members.api';
import { Member } from '@/models/member/member';
import { MEMBER } from '@/constants/column/member-column';
import OfficerInformationView from './officer-information.view';
import { OfficerHistoryApi } from '@/api/history/officer-history.api';

type OfficerInformationProps = {
  selectedOfficer: Officer;
  onClickOfficer: (officer: Officer) => void;
};

const OfficerInformation = ({
  selectedOfficer,
  onClickOfficer,
}: OfficerInformationProps) => {
  const t_popup = useScopedI18n('popup');

  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);

  const membersApi = new MembersApi(false);
  const officersApi = new OfficersApi(false);
  const officerHistoryApi = new OfficerHistoryApi(false);

  // 에러 처리
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 수정할 그룹명
  const [isEditShown, setIsEditShown] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(BLANK);

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

  // 선택된 교인 목록
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  // 그룹에 교인 다중 추가를 위한 모달 활성화 여부
  const [isAddModalShown, setIsAddModalShown] = useState<boolean>(false);

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

  const onChangeEditOfficerName = (event: ChangeEvent<HTMLInputElement>) => {
    setEditName(getFormattedTitle(event.target.value));
  };

  const onClickSaveEdit = async () => {
    if (!getIsWellFormedTitle(editName)) {
      return;
    }

    try {
      const response = await officersApi.editOfficerName(
        { churchId, officerId: selectedOfficer.id as string },
        { name: editName }
      );
      await dispatch(fetchOfficers());
      onClickOfficer(response.data.data);
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
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const response = await membersApi.getMembers({
        churchId,
        officer: [selectedOfficer.id as string],
        selectedColumns: [MEMBER.OFFICER, MEMBER.BIRTH, MEMBER.MOBILE_PHONE],
        page,
        take: 30,
        order: orderBy
          ? orderBy === MEMBER.AGE
            ? MEMBER.BIRTH
            : orderBy
          : undefined,
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

      for (const member of selectedMembers) {
        // 새 그룹에 이력 생성
        await officerHistoryApi.createOfficerHistory(
          { churchId, memberId: member.id },
          {
            officerId: selectedOfficer.id as string,
          }
        );
      }

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
      setSelectedMembers([]);
      setIsAddModalShown(false);
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
    fetchMembers();
  }, [selectedOfficer.id]);

  useEffect(() => {
    setEditName(selectedOfficer.name);
  }, [selectedOfficer.name]);

  const props = {
    selectedOfficer,
    isAddModalShown,
    isEditShown,
    editName,
    members,
    selectedMembers,
    setSelectedMembers,
    loadMembers,
    orderBy,
    orderDirection,
    onClickHeaderItem,
    onClickOfficer,
    onClickEditOpen,
    onClickEditClose,
    onChangeEditOfficerName,
    onClickSaveEdit,
    onClickAddModalOpen,
    onClickAddModalClose,
    onClickSaveNewMembers,
  };
  return (
    <>
      <OfficerInformationView {...props} />
    </>
  );
};

export default OfficerInformation;
