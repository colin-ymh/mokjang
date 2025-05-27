import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import MemberEducationView from '@/components/molecules/member/information/member-education.view';
import { EducationHistory } from '@/models/member/history';
import { EducationHistoryApi } from '@/api/history/education-history.api';
import { ORDER_DIRECTION } from '@/constants/constant';

type MemberEducation = {};

const MemberEducation = ({}: MemberEducation) => {
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const educationHistoryApi = new EducationHistoryApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  // 사용자의 교육 이력
  const [educationHistory, setEducationHistory] = useState<EducationHistory[]>(
    []
  );

  // // 교육 추가 모달 활성화 여부
  // const [isModalShown, setIsModalShown] = useState<boolean>(false);
  //
  // // 수정하려는 교육
  // const [targetEducation, setTargetEducation] = useState<EducationHistory>(
  //   DEFAULT_EDUCATION_HISTORY
  // );

  // // 교육 추가 모달 활성화
  // const onClickOpenModal = () => {
  //   setIsModalShown(true);
  // };
  //
  // // 모달 닫기
  // const onClickCloseModal = () => {
  //   setIsModalShown(false);
  //   setTargetEducation(DEFAULT_EDUCATION_HISTORY);
  // };

  // // 교육 선택 시
  // const onClickEditEducation = (education: EducationHistory) => {
  //   setTargetEducation(education);
  //   setIsModalShown(true);
  // };

  // 서버에서 데이터 로드
  const fetchData = async () => {
    try {
      const response = await educationHistoryApi.getEducationHistory({
        churchId,
        memberId: targetMember.id,
        orderDirection: ORDER_DIRECTION.DESC,
      });

      const newEducationHistory = response.data.data;
      setEducationHistory(newEducationHistory);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 교인의 교육 이력 불러오기
  useEffect(() => {
    fetchData();
  }, [targetMember.id]);

  // // 새교육 저장하기
  // const onClickSaveNewEducation = (
  //   educationId: string,
  //   startDate: string,
  //   status: EDUCATION_STATUS,
  //   endDate?: string
  // ) => {
  //   educationHistoryApi
  //     .createEducationHistory(
  //       { churchId, memberId: targetMember.id },
  //       { educationId, startDate, status, endDate }
  //     )
  //     .then((response) => {
  //       setIsModalShown(false);
  //       fetchData();
  //       setTargetEducation(DEFAULT_EDUCATION_HISTORY);
  //     });
  // };
  //
  // // 기존 교육 수정하기
  // const onClickSaveEditEducation = (
  //   educationId?: string,
  //   startDate?: string,
  //   endDate?: string,
  //   status?: EDUCATION_STATUS
  // ) => {
  //   educationHistoryApi
  //     .editEducationHistory(
  //       {
  //         churchId,
  //         memberId: targetMember.id,
  //         educationHistoryId: targetEducation.id,
  //       },
  //       { educationId, startDate, endDate, status }
  //     )
  //     .then((response) => {
  //       setIsModalShown(false);
  //       fetchData();
  //       setTargetEducation(DEFAULT_EDUCATION_HISTORY);
  //     });
  // };
  //
  // // 기존 교육 삭제하기
  // const onClickDeleteEducation = (educationId: string) => {
  //   educationHistoryApi
  //     .deleteEducationHistory({
  //       churchId,
  //       memberId: targetMember.id,
  //       educationHistoryId: educationId,
  //     })
  //     .then((response) => {
  //       fetchData();
  //     });
  // };

  const props = {
    educationHistory,
    // targetEducation,
    // isModalShown,
    // onClickOpenModal,
    // onClickCloseModal,
    // onClickEditEducation,
    // onClickSaveNewEducation,
    // onClickSaveEditEducation,
    // onClickDeleteEducation,
  };

  return (
    <>
      <MemberEducationView {...props} />
    </>
  );
};

export default MemberEducation;
