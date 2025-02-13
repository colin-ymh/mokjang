import { useState } from 'react';
import TermInformationView from '@/components/organisms/management/education/term/term-information.view';
import {
  DEFAULT_EDUCATION_SESSION,
  Education,
  EducationEnrollment,
  EducationSession,
  EducationTerm,
} from '@/models/management/management';
import { EDUCATION_TERM_HEADER_ID } from '@/constants/layout/header';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import TermRegister from '@/components/atoms/management/education/term-register';
import EditSession from '@/components/atoms/management/education/term/edit-session';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { EducationTermsApi } from '@/api/management/education/education-terms.api';

type TermInformationProps = {
  education: Education;
  term: EducationTerm;
  enrollments: EducationEnrollment[];
  sessions: EducationSession[];
  fetchEnrollments: () => void;
  fetchTerms: () => void;
  onClickClose: () => void;
};

const TermInformation = ({
  education,
  term,
  enrollments,
  sessions,
  fetchEnrollments,
  fetchTerms,
  onClickClose,
}: TermInformationProps) => {
  // const educationAttendanceApi = new EducationAttendanceApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const educationTermsApi = new EducationTermsApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 선택된 회차
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    EDUCATION_TERM_HEADER_ID.INFORMATION
  );

  // 기수 수정모달 활성화 여부
  const [isTermModalShown, setIsTermModalShown] = useState<boolean>(false);

  // 회차 수정모달 활성화 여부
  const [isSessionModalShown, setIsSessionModalShown] =
    useState<boolean>(false);

  // 기수들 정보
  const [terms, setTerms] = useState<EducationTerm[]>([]);

  // 기수/세션 추가 모달 열기
  const onClickItem = (isSession: boolean) => {
    if (isSession) {
      setIsSessionModalShown(true);
    } else {
      setIsTermModalShown(true);
    }
  };

  // 기수 추가 모달 닫기
  const onClickModalClose = () => {
    setIsTermModalShown(false);
  };

  // 세션 모달 닫기
  const onClickSessionModalClose = () => {
    setIsSessionModalShown(false);
  };

  // 회차 선택
  const onClickHeaderItem = async (id: string) => {
    try {
      if (id !== EDUCATION_TERM_HEADER_ID.INFORMATION) {
        // getAttendance가 끝난 후 setSelectedSessionId 호출
        // await getAttendance(id).then(() => {
        setSelectedSessionId(id);
        // });
      } else {
        setSelectedSessionId(id);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 기수 삭제하기
  const onClickConfirmDelete = async (id: string) => {
    try {
      const response = await educationTermsApi.deleteEducationTerms({
        churchId,
        educationId: education.id,
        educationTermId: term.id,
      });
      if (response) {
        fetchTerms();
        onClickClose();
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 특정 회차의 출석부 생성하기
  // const getAttendance = async (sessionId: string) => {
  //   await educationAttendanceApi
  //     .getEducationAttendances({
  //       churchId,
  //       educationId: education.id,
  //       educationTermId: term.id,
  //       sessionId,
  //     })
  //     .then((response) => {
  //       // 현재 출석부
  //       const prevAttendance = response.data;
  //
  //       // 현재 등록 인원 수와 출석부 길이를 비교
  //       // 다르다면, 출석부 새로 생성
  //       if (enrollments.length !== prevAttendance.length) {
  //         educationAttendanceApi.createEducationAttendances({
  //           churchId,
  //           educationId: education.id,
  //           educationTermId: term.id,
  //           sessionId,
  //         });
  //       }
  //     });
  // };

  const props = {
    header: {
      education,
      term,
      selectedSessionId,
      sessions,
      onClickHeaderItem,
      onClickConfirmDelete,
    },
    content: {
      term,
      selectedSessionId,
      enrollments,
      sessions,
      fetchTerms,
      fetchEnrollments,
      educationId: education.id,
      onClickItem,
    },
  };

  return (
    <>
      <TermInformationView {...props} />
      <CustomPopup
        isShow={isTermModalShown}
        onClickClose={onClickModalClose}
        width={30}
        height={80}
        isPercentage={true}
      >
        <TermRegister
          education={education}
          terms={terms}
          onClickClose={onClickModalClose}
          fetchTerms={fetchTerms}
          targetTerm={term}
        />
      </CustomPopup>
      <CustomPopup
        isShow={isSessionModalShown}
        onClickClose={onClickSessionModalClose}
        width={30}
        height={80}
        isPercentage={true}
      >
        <EditSession
          targetSession={
            sessions.find((session) => session.id === selectedSessionId) ||
            DEFAULT_EDUCATION_SESSION
          }
          educationId={education.id}
          onClickClose={onClickSessionModalClose}
          fetchTerms={fetchTerms}
        />
      </CustomPopup>
    </>
  );
};

export default TermInformation;
