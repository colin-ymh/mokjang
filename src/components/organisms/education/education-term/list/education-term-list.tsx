import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchEducationSessions,
  fetchEducationTerms,
  setEducationTerms,
} from '@/redux/reducers/education-term-filter-reducer';

import { EducationTermsApi } from '@/api/education/education-terms.api';

import { setTargetEducationTerm } from '@/redux/reducers/target-education-term-reducer';
import {
  DEFAULT_EDUCATION_SESSION,
  DEFAULT_EDUCATION_TERM,
  EducationEnrollment,
  EducationSession,
  EducationTerm,
} from '@/models/education/education';
import EducationTermListView from '@/components/organisms/education/education-term/list/education-term-list.view';
import { EducationEnrollmentsApi } from '@/api/education/education-enrollments.api';
import { EducationSessionsApi } from '@/api/education/education-sessions.api';
import { setTargetEducationSession } from '@/redux/reducers/target-education-session-reducer';

type EducationTermListProps = {
  isNewEducationTerm?: boolean;
};

const EducationTermList = ({ isNewEducationTerm }: EducationTermListProps) => {
  const educationTermsApi = new EducationTermsApi(false);
  const educationEnrollmentsApi = new EducationEnrollmentsApi(false);
  const educationSessionsApi = new EducationSessionsApi(false);

  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );

  const {
    educationTerms,
    educationTermFilter,
    educationTermOrderBy,
    educationTermOrderDirection,
  } = useSelector((state: RootState) => state.educationTermFilter);
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ========== 기수 ==========
  // 기수 상세정보 팝업 On/Off
  const [isEducationTermInformationShown, setIsEducationTermInformationShown] =
    useState<boolean>(false);

  // 서버에서 불러오는 기수 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 삭제 확인 팝업
  const [isTermPopupShown, setIsTermPopupShown] = useState<boolean>(false);

  // 수정 팝업 On/Off
  const [isEditTermShown, setIsEditTermShown] = useState<boolean>(false);

  // 기수 삭제 확인 팝업 열기
  const onClickDeleteTermConfirmOpen = () => {
    setIsTermPopupShown(true);
  };

  // 기수 삭제 확인 팝업 닫기
  const onClickDeleteTermConfirmClose = () => {
    setIsTermPopupShown(false);
  };

  // 무한 스크롤로 데이터 추가 로드
  const loadEducationTerms = async () => {
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchEducationTerms({
          churchId,
          currentPage: page + 1,
          educationId: targetEducation.id,
        })
      );
      if (fetchEducationTerms.fulfilled.match(result)) {
        const newEducationTerms: EducationTerm[] = result.payload;
        if (newEducationTerms.length > 0) {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(
            educationTerms.map((educationTerm) => educationTerm.id)
          );
          const filteredNewEducationTerms = newEducationTerms.filter(
            (educationTerm) => !existingIds.has(educationTerm.id)
          );
          dispatch(
            setEducationTerms([...educationTerms, ...filteredNewEducationTerms])
          );
          await dispatch(fetchEducationSessions({ churchId }));
          setPage((prev) => prev + 1); // 다음 페이지로 이동
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 정보가 변경될 때, 교인들을 다시 불러오는 부분
  useEffect(() => {
    const fetchInitialEducationTerms = async () => {
      try {
        const result = await dispatch(
          fetchEducationTerms({
            churchId,
            currentPage: 1,
            educationId: targetEducation.id,
          })
        );
        if (fetchEducationTerms.fulfilled.match(result)) {
          const newEducationTerms: EducationTerm[] = result.payload;
          dispatch(setEducationTerms(newEducationTerms));
          await dispatch(fetchEducationSessions({ churchId }));
          setPage(1);
        }
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    fetchInitialEducationTerms();
  }, [
    churchId,
    educationTermFilter,
    educationTermOrderBy,
    educationTermOrderDirection,
    isNewEducationTerm,
  ]);

  const onClickEditTermDone = async () => {
    try {
      const prevEducationTerm = educationTerms.find(
        (term) => term.id === targetEducationTerm.id
      );

      if (!prevEducationTerm) return;

      // 변경된 필드만 전송
      const updatedFields = {
        term:
          prevEducationTerm.term !== targetEducationTerm.term
            ? targetEducationTerm.term
            : undefined,
        startDate:
          prevEducationTerm.startDate !== targetEducationTerm.startDate
            ? targetEducationTerm.startDate
            : undefined,
        endDate:
          prevEducationTerm.endDate !== targetEducationTerm.endDate
            ? targetEducationTerm.endDate
            : undefined,
        content:
          prevEducationTerm.content !== targetEducationTerm.content
            ? targetEducationTerm.content
            : undefined,
        inChargeId:
          prevEducationTerm.inChargeId !== targetEducationTerm.inChargeId
            ? targetEducationTerm.inChargeId
            : undefined,
      };

      // 기수 수정
      const editResponse = await educationTermsApi.editEducationTerm(
        {
          churchId,
          educationId: targetEducation.id,
          educationTermId: targetEducationTerm.id,
        },
        updatedFields
      );
      const newEducationTerm: EducationTerm = editResponse.data.data;

      // 기존 수강 인원 조회
      const enrollmentResponse =
        await educationEnrollmentsApi.getEducationEnrollments({
          churchId,
          educationId: targetEducation.id,
          educationTermId: newEducationTerm.id,
          take: newEducationTerm.enrollmentCount,
        });
      const prevEnrollments: EducationEnrollment[] =
        enrollmentResponse.data.data;

      const prevEnrollmentIds = new Set(
        prevEnrollments.map((enrollment) => enrollment.memberId)
      );
      const newEnrollmentIds = new Set(
        targetEducationTerm.educationEnrollments.map((e) => e.memberId)
      );

      // 추가할 수강생
      const addEnrollments = targetEducationTerm.educationEnrollments.filter(
        (enrollment) => !prevEnrollmentIds.has(enrollment.memberId)
      );

      // 삭제할 수강생
      const deleteEnrollments = prevEnrollments.filter(
        (enrollment) => !newEnrollmentIds.has(enrollment.memberId)
      );

      // 수강생 추가
      for (const enrollment of addEnrollments) {
        await educationEnrollmentsApi.createEducationEnrollments(
          {
            churchId,
            educationId: newEducationTerm.educationId,
            educationTermId: newEducationTerm.id,
          },
          {
            memberId: enrollment.memberId,
            status: enrollment.status,
          }
        );
      }

      // 수강생 삭제 (※ delete API 필요시 수정)
      for (const enrollment of deleteEnrollments) {
        await educationEnrollmentsApi.deleteEducationEnrollment({
          churchId,
          educationId: newEducationTerm.educationId,
          educationTermId: newEducationTerm.id,
          educationEnrollmentId: enrollment.id,
        });
      }

      // 기수 목록 갱신
      const updatedTerms = educationTerms.map((term) =>
        term.id === newEducationTerm.id ? newEducationTerm : term
      );
      dispatch(setEducationTerms(updatedTerms));

      setIsEditTermShown(false);
      setTimeout(() => setIsEducationTermInformationShown(true), 500);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 목록에서 기수를 선택하여 상세 페이지로 이동
  const onClickEducationTermItem = async (educationTermId: string) => {
    try {
      await educationTermsApi
        .getEducationTerm({
          churchId,
          educationId: targetEducation.id,
          educationTermId,
        })
        .then(async (response) => {
          const educationTerm: EducationTerm = response.data.data;

          const enrollmentResponse =
            await educationEnrollmentsApi.getEducationEnrollments({
              churchId,
              educationId: targetEducation.id,
              educationTermId,
              take: educationTerm.enrollmentCount,
            });

          const enrollments = enrollmentResponse.data.data;

          const sessionResponse =
            await educationSessionsApi.getEducationSessions({
              churchId,
              educationId: targetEducation.id,
              educationTermId,
            });

          const sessions = sessionResponse.data;

          dispatch(
            setTargetEducationTerm({
              ...educationTerm,
              educationEnrollments: enrollments,
              educationSessions: sessions,
            })
          );
          setIsEducationTermInformationShown(true);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickCloseTerm = () => {
    setIsEducationTermInformationShown(false);
    dispatch(setTargetEducationTerm(DEFAULT_EDUCATION_TERM));
  };

  // 기수 삭제하기
  const onClickDeleteTerm = async () => {
    try {
      const response = await educationTermsApi.deleteEducationTerm({
        churchId,
        educationId: targetEducation.id,
        educationTermId: targetEducationTerm.id,
      });

      if (response.status === 200) {
        // 초기화 후 다시 로드
        setPage(1);
        const result = await dispatch(
          fetchEducationTerms({
            churchId,
            currentPage: 1,
            educationId: targetEducation.id,
          })
        );
        if (fetchEducationTerms.fulfilled.match(result)) {
          dispatch(setEducationTerms(result.payload));
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetEducationTerm(DEFAULT_EDUCATION_TERM));
      setIsEducationTermInformationShown(false);
    }
  };

  // 기수 수정 페이지 종료
  const onClickEditTermClose = () => {
    setIsEditTermShown(false);
    setTimeout(() => {
      setIsEducationTermInformationShown(true);
    }, 500);
  };

  // 기수 수정 페이지 열기
  const onClickEditTermOpen = () => {
    setIsEducationTermInformationShown(false);
    setTimeout(() => {
      setIsEditTermShown(true);
    }, 500);
  };

  useEffect(() => {
    setIsTermPopupShown(false);
  }, [targetEducationTerm]);
  // ========== 기수 ==========

  // ========== 회차 ==========

  // 회차 추가 팝업 on/off
  const [isAddEducationSessionShown, setIsAddEducationSessionShown] =
    useState<boolean>(false);

  const onClickOpenAddEducationSession = () => {
    if (isEducationTermInformationShown) {
      setIsEducationTermInformationShown(false);
      setTimeout(() => {
        setIsAddEducationSessionShown(true);
      }, 500);
    } else {
      setIsAddEducationSessionShown(true);
    }
  };

  const onClickCloseAddEducationSession = () => {
    setIsAddEducationSessionShown(false);
    if (targetEducationTerm.id) {
      setTimeout(() => {
        setIsEducationTermInformationShown(true);
      }, 500);
    }
  };

  const onClickAddSessionsDone = async () => {
    try {
      await educationSessionsApi
        .createEducationSession({
          churchId,
          educationId: targetEducation.id,
          educationTermId: targetEducationTerm.id,
        })
        .then((response) => {
          const newSession = response.data;

          const newTargetEducationTerm = {
            ...targetEducationTerm,
            educationSessions: [
              ...targetEducationTerm.educationSessions,
              newSession,
            ],
          };
          dispatch(setTargetEducationTerm(newTargetEducationTerm));

          const newEducationTerms = educationTerms.map((term) => {
            if (term.id === newTargetEducationTerm.id) {
              return newTargetEducationTerm;
            } else {
              return term;
            }
          });
          dispatch(setEducationTerms(newEducationTerms));
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetEducationSession(DEFAULT_EDUCATION_SESSION));
      setIsAddEducationSessionShown(false);
    }
  };

  // 회차 상세정보 팝업 On/Off
  const [
    isEducationSessionInformationShown,
    setIsEducationSessionInformationShown,
  ] = useState<boolean>(false);

  // 삭제 확인 팝업
  const [isSessionPopupShown, setIsSessionPopupShown] =
    useState<boolean>(false);

  // 수정 팝업 On/Off
  const [isEditSessionShown, setIsEditSessionShown] = useState<boolean>(false);

  // 회차 삭제 확인 팝업 열기
  const onClickDeleteSessionConfirmOpen = () => {
    setIsEducationTermInformationShown(false);
    setTimeout(() => {
      setIsSessionPopupShown(true);
    }, 500);
  };

  // 회차 삭제 확인 팝업 닫기
  const onClickDeleteSessionConfirmClose = () => {
    setIsSessionPopupShown(false);
    setTimeout(() => {
      setIsEducationTermInformationShown(true);
    }, 500);
  };

  const onClickEditSessionDone = async () => {
    try {
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 목록에서 회차를 선택하여 상세 페이지로 이동
  const onClickEducationSessionItem = async (
    educationTermId: string,
    educationSessionId: string
  ) => {
    try {
      await educationSessionsApi
        .getEducationSession({
          churchId,
          educationId: targetEducation.id,
          educationTermId,
          educationSessionId,
        })
        .then(async (response) => {
          const educationSession: EducationSession = response.data;

          dispatch(setTargetEducationSession(educationSession));
          setIsEducationSessionInformationShown(true);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickCloseSession = () => {
    setIsEducationSessionInformationShown(false);
    dispatch(setTargetEducationSession(DEFAULT_EDUCATION_SESSION));
  };

  // 회차 삭제하기
  const onClickDeleteSession = async () => {
    try {
      await educationSessionsApi.deleteEducationSession({
        churchId,
        educationId: targetEducation.id,
        educationTermId: targetEducationTerm.id,
        educationSessionId: targetEducationSession.id,
      });

      const response = await educationSessionsApi.getEducationSessions({
        churchId,
        educationId: targetEducation.id,
        educationTermId: targetEducationTerm.id,
      });

      const newSessions: EducationSession[] = response.data.data;

      const newTargetEducationTerm = {
        ...targetEducationTerm,
        educationSessions: newSessions,
      };
      dispatch(setTargetEducationTerm(newTargetEducationTerm));

      const newEducationTerms = educationTerms.map((term) => {
        if (term.id !== targetEducationTerm.id) {
          return newTargetEducationTerm;
        } else {
          return term;
        }
      });
      dispatch(setEducationTerms(newEducationTerms));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetEducationSession(DEFAULT_EDUCATION_SESSION));
      setIsEducationSessionInformationShown(false);
    }
  };

  // 회차 수정 페이지 종료
  const onClickEditSessionClose = () => {
    setIsEditSessionShown(false);
    setTimeout(() => {
      setIsEducationSessionInformationShown(true);
    }, 500);
  };

  // 회차 수정 페이지 열기
  const onClickEditSessionOpen = () => {
    setIsEducationSessionInformationShown(false);
    setTimeout(() => {
      setIsEditSessionShown(true);
    }, 500);
  };

  useEffect(() => {
    setIsSessionPopupShown(false);
  }, [targetEducationSession]);

  // ========== 회차 ==========

  const props = {
    list: {
      onClickEducationTermItem,
      loadEducationTerms,
      onClickEducationSessionItem,
      onClickOpenAddEducationSession,
    },
    information: {
      isLoading,
      // 기수
      isEducationTermInformationShown,
      isEditTermShown,
      isTermPopupShown,
      onClickCloseTerm,
      onClickDeleteTerm,
      onClickDeleteTermConfirmOpen,
      onClickDeleteTermConfirmClose,
      onClickEditTermDone,
      onClickEditTermOpen,
      onClickEditTermClose,
      // 회차
      isAddEducationSessionShown,
      isEducationSessionInformationShown,
      isEditSessionShown,
      isSessionPopupShown,
      onClickOpenAddEducationSession,
      onClickCloseAddEducationSession,
      onClickAddSessionsDone,
      onClickCloseSession,
      onClickDeleteSession,
      onClickDeleteSessionConfirmOpen,
      onClickDeleteSessionConfirmClose,
      onClickEditSessionDone,
      onClickEditSessionOpen,
      onClickEditSessionClose,
    },
  };

  return (
    <>
      <EducationTermListView {...props} />
    </>
  );
};

export default EducationTermList;
