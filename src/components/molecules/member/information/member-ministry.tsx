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
import { Member } from '@/models/member/member';

type MemberMinistryProps = {
  targetMember: Member;
};

const MemberMinistry = ({ targetMember }: MemberMinistryProps) => {
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const ministryHistoryApi = new MinistryHistoryApi(false);

  // 사용자의 그룹 이력
  const [ministryHistory, setMinistryHistory] = useState<MinistryHistory[]>([]);

  // 그룹 추가 모달 활성화 여부
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  // 수정하려는 그룹
  const [targetMinistry, setTargetMinistry] = useState<MinistryHistory>(
    DEFAULT_MINISTRY_HISTORY
  );

  // 모달 닫기
  const onClickCloseModal = () => {
    setIsModalShown(false);
    setTargetMinistry(DEFAULT_MINISTRY_HISTORY);
  };

  // 그룹 선택 시
  const onClickEditMinistry = (ministry: MinistryHistory) => {
    setTargetMinistry(ministry);
    setIsModalShown(true);
  };

  // 서버에서 데이터 로드
  const fetchData = () => {
    ministryHistoryApi
      .getMinistryHistory({
        churchId,
        memberId: targetMember.id,
        orderDirection: ORDER_DIRECTION.DESC,
      })
      .then((response) => {
        const newMinistryHistory = response.data;
        setMinistryHistory(newMinistryHistory);
      });
  };

  // 교인의 그룹 이력 불러오기
  useEffect(() => {
    fetchData();
  }, [targetMember.id]);

  // 기존 그룹 수정하기
  const onClickSaveMinistryHistory = (startDate?: string, endDate?: string) => {
    ministryHistoryApi
      .editMinistryHistory(
        {
          churchId,
          memberId: targetMember.id,
          ministryHistoryId: targetMinistry.id,
        },
        { startDate, endDate }
      )
      .then(() => {
        setIsModalShown(false);
        fetchData();
        setTargetMinistry(DEFAULT_MINISTRY_HISTORY);
      });
  };

  // 기존 그룹 삭제하기
  const onClickDeleteMinistry = (ministryId: string) => {
    ministryHistoryApi
      .deleteMinistryHistory({
        churchId,
        memberId: targetMember.id,
        ministryHistoryId: ministryId,
      })
      .then(() => {
        fetchData();
      });
  };

  const props = {
    ministryHistory,
    targetMinistry,
    isModalShown,
    onClickCloseModal,
    onClickEditMinistry,
    onClickSaveMinistryHistory,
    onClickDeleteMinistry,
  };

  return (
    <>
      <MemberMinistryView {...props} />
    </>
  );
};

export default MemberMinistry;
