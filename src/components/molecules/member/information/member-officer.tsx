import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import MemberOfficerView from '@/components/molecules/member/information/member-officer.view';
import {
  DEFAULT_OFFICER_HISTORY,
  OfficerHistory,
} from '@/models/member/history';
import { OfficerHistoryApi } from '@/api/history/officer-history.api';
import { ORDER_DIRECTION } from '@/constants/constant';
import { Member } from '@/models/member/member';

type MemberOfficerProps = {
  targetMember: Member;
};

const MemberOfficer = ({ targetMember }: MemberOfficerProps) => {
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const officerHistoryApi = new OfficerHistoryApi(false);

  // 사용자의 직분 이력
  const [officerHistory, setOfficerHistory] = useState<OfficerHistory[]>([]);

  // 직분 추가 모달 활성화 여부
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  // 수정하려는 직분
  const [targetOfficerHistory, setTargetOfficerHistory] =
    useState<OfficerHistory>(DEFAULT_OFFICER_HISTORY);

  // 에러 상태 관리
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 모달 닫기
  const onClickCloseModal = () => {
    setIsModalShown(false);
    setTargetOfficerHistory(DEFAULT_OFFICER_HISTORY);
  };

  // 직분 선택 시
  const onClickEditOfficer = (officer: OfficerHistory) => {
    setTargetOfficerHistory(officer);
    setIsModalShown(true);
  };

  // 서버에서 데이터 로드
  const fetchData = async () => {
    try {
      const response = await officerHistoryApi.getOfficerHistory({
        churchId,
        memberId: targetMember.id,
        orderDirection: ORDER_DIRECTION.DESC,
      });
      const newOfficerHistory = response.data.data;
      if (newOfficerHistory) {
        setOfficerHistory(newOfficerHistory);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 교인의 직분 이력 불러오기
  useEffect(() => {
    fetchData();
  }, [targetMember.id]);

  // 기존 직분 수정하기
  const onClickSaveOfficerHistory = async (
    startDate?: string,
    endDate?: string
  ) => {
    try {
      await officerHistoryApi.editOfficerHistory(
        {
          churchId,
          memberId: targetMember.id,
          officerHistoryId: targetOfficerHistory.id,
        },
        { startDate, endDate }
      );
      setIsModalShown(false);
      fetchData();
      setTargetOfficerHistory(DEFAULT_OFFICER_HISTORY);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 기존 직분 삭제하기
  const onClickDeleteOfficer = async (officerId: string) => {
    try {
      await officerHistoryApi.deleteOfficerHistory({
        churchId,
        memberId: targetMember.id,
        officerHistoryId: officerId,
      });
      fetchData();
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const props = {
    officerHistory,
    targetOfficerHistory,
    isModalShown,
    onClickCloseModal,
    onClickEditOfficer,
    onClickSaveOfficerHistory,
    onClickDeleteOfficer,
  };

  return (
    <>
      <MemberOfficerView {...props} />
    </>
  );
};

export default MemberOfficer;
