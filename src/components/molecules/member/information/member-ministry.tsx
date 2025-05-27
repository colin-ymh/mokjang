import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import MemberMinistryView from '@/components/molecules/member/information/member-ministry.view';
import {
  DEFAULT_MINISTRY_HISTORY,
  MinistryHistory,
} from '@/models/member/history';
import { MinistryHistoryApi } from '@/api/history/ministry-history.api';
import { ORDER_DIRECTION } from '@/constants/constant';

type MemberMinistryProps = {};

const MemberMinistry = ({}: MemberMinistryProps) => {
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const ministryHistoryApi = new MinistryHistoryApi(false);

  // 사용자의 그룹 이력
  const [ministryHistory, setMinistryHistory] = useState<MinistryHistory[]>([]);

  // 그룹 추가 모달 활성화 여부
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  // 수정하려는 그룹
  const [targetMinistryHistory, setTargetMinistryHistory] =
    useState<MinistryHistory>(DEFAULT_MINISTRY_HISTORY);

  // 에러 상태 관리
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 모달 닫기
  const onClickCloseModal = () => {
    setIsModalShown(false);
    setTargetMinistryHistory(DEFAULT_MINISTRY_HISTORY);
  };

  // 그룹 선택 시
  const onClickEditMinistry = (ministry: MinistryHistory) => {
    setTargetMinistryHistory(ministry);
    setIsModalShown(true);
  };

  // 서버에서 데이터 로드
  const fetchData = async () => {
    try {
      const response = await ministryHistoryApi.getMinistryHistory({
        churchId,
        memberId: targetMember.id,
        orderDirection: ORDER_DIRECTION.DESC,
      });
      const newMinistryHistory = response.data.data;
      setMinistryHistory(newMinistryHistory);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 교인의 그룹 이력 불러오기
  useEffect(() => {
    fetchData();
  }, [targetMember.id]);

  // 기존 그룹 수정하기
  const onClickSaveMinistryHistory = async (
    startDate?: string,
    endDate?: string
  ) => {
    try {
      await ministryHistoryApi.editMinistryHistory(
        {
          churchId,
          memberId: targetMember.id,
          ministryHistoryId: targetMinistryHistory.id,
        },
        { startDate, endDate }
      );
      setIsModalShown(false);
      fetchData();
      setTargetMinistryHistory(DEFAULT_MINISTRY_HISTORY);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 기존 사역 이력 삭제하기
  const onClickConfirmDelete = async (ministryId: string) => {
    try {
      await ministryHistoryApi.deleteMinistryHistory({
        churchId,
        memberId: targetMember.id,
        ministryHistoryId: ministryId,
      });
      fetchData();
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const props = {
    ministryHistory,
    targetMinistryHistory,
    isModalShown,
    onClickCloseModal,
    onClickEditMinistry,
    onClickSaveMinistryHistory,
    onClickConfirmDelete,
  };

  return (
    <>
      <MemberMinistryView {...props} />
    </>
  );
};

export default MemberMinistry;
