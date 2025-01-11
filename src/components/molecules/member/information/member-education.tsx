import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import MemberEducationView from '@/components/molecules/member/information/member-education.view';
import {
  DEFAULT_EDUCATION_HISTORY,
  EducationHistory,
} from '@/models/member/history';
import { EducationHistoryApi } from '@/api/history/education-history';
import { EDUCATION_STATUS, ORDER_DIRECTION } from '@/constants/constant';

const MemberEducation = () => {
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const targetMember = useSelector(
    (state: RootState) => state.targetMember.targetMember
  );
  const educationHistoryApi = new EducationHistoryApi(false);

  // 사용자의 그룹 이력
  const [educationHistory, setEducationHistory] = useState<EducationHistory[]>(
    []
  );

  // 그룹 추가 모달 활성화 여부
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  // 수정하려는 그룹
  const [targetEducation, setTargetEducation] = useState<EducationHistory>(
    DEFAULT_EDUCATION_HISTORY
  );

  // 그룹 추가 모달 활성화
  const onClickOpenModal = () => {
    setIsModalShown(true);
  };

  // 모달 닫기
  const onClickCloseModal = () => {
    setIsModalShown(false);
    setTargetEducation(DEFAULT_EDUCATION_HISTORY);
  };

  // 그룹 선택 시
  const onClickEditEducation = (education: EducationHistory) => {
    setTargetEducation(education);
    setIsModalShown(true);
  };

  // 서버에서 데이터 로드
  const fetchData = () => {
    educationHistoryApi
      .getEducationHistory({
        churchId,
        memberId: targetMember.id,
        orderDirection: ORDER_DIRECTION.DESC,
      })
      .then((response) => {
        const newEducationHistory = response.data;
        setEducationHistory(newEducationHistory);
      });
  };

  // 교인의 그룹 이력 불러오기
  useEffect(() => {
    fetchData();
  }, [targetMember.id]);

  // 새그룹 저장하기
  const onClickSaveNewEducation = (
    educationId: string,
    startDate: string,
    status: EDUCATION_STATUS,
    endDate?: string
  ) => {
    educationHistoryApi
      .createEducationHistory(
        { churchId, memberId: targetMember.id },
        { educationId, startDate, status, endDate }
      )
      .then((response) => {
        setIsModalShown(false);
        fetchData();
        setTargetEducation(DEFAULT_EDUCATION_HISTORY);
      });
  };

  // 기존 그룹 수정하기
  const onClickSaveEditEducation = (
    educationId?: string,
    startDate?: string,
    endDate?: string,
    status?: EDUCATION_STATUS
  ) => {
    educationHistoryApi
      .editEducationHistory(
        {
          churchId,
          memberId: targetMember.id,
          educationHistoryId: targetEducation.id,
        },
        { educationId, startDate, endDate, status }
      )
      .then((response) => {
        setIsModalShown(false);
        fetchData();
        setTargetEducation(DEFAULT_EDUCATION_HISTORY);
      });
  };

  // 기존 그룹 삭제하기
  const onClickDeleteEducation = (educationId: string) => {
    educationHistoryApi
      .deleteEducationHistory({
        churchId,
        memberId: targetMember.id,
        educationHistoryId: educationId,
      })
      .then((response) => {
        fetchData();
      });
  };

  const props = {
    educationHistory,
    targetEducation,
    isModalShown,
    onClickOpenModal,
    onClickCloseModal,
    onClickEditEducation,
    onClickSaveNewEducation,
    onClickSaveEditEducation,
    onClickDeleteEducation,
  };

  return (
    <>
      <MemberEducationView {...props} />
    </>
  );
};

export default MemberEducation;
