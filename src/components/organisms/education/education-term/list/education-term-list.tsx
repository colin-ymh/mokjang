import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchEducationSessions,
  fetchEducationTerms,
  setEducationTerms,
} from '@/redux/reducers/filter/education-term-filter-reducer';

import { EducationTermsApi } from '@/api/education/education-terms.api';

import { setTargetEducationTerm } from '@/redux/reducers/target/target-education-term-reducer';
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
import { setTargetEducationSession } from '@/redux/reducers/target/target-education-session-reducer';
import { EducationAttendanceApi } from '@/api/education/education-attendance.api';
import { getIsWellFormedTitle } from '@/utils/check';
import { BLANK } from '@/constants/constant';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import { DESTRUCTIVE } from '@/constants/styles/color';

type EducationTermListProps = {
  isInProgress?: boolean;
};

const EducationTermList = ({ isInProgress }: EducationTermListProps) => {
  const educationTermsApi = new EducationTermsApi(false);
  const educationEnrollmentsApi = new EducationEnrollmentsApi(false);
  const educationSessionsApi = new EducationSessionsApi(false);
  const educationAttendanceApi = new EducationAttendanceApi(false);

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

  const [isTermSaveEnabled, setIsTermSaveEnabled] = useState<boolean>(false);
  const [isSessionSaveEnabled, setIsSessionSaveEnabled] =
    useState<boolean>(false);

  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>(BLANK);

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
          isInProgress,
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
            isInProgress,
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
    isInProgress,
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
      if (error instanceof Error) {
        setToastText(error.message);
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  // 목록에서 기수를 선택하여 상세 페이지로 이동
  const onClickEducationTermItem = async (
    educationId: string,
    educationTermId: string
  ) => {
    try {
      await educationTermsApi
        .getEducationTerm({
          churchId,
          educationId,
          educationTermId,
        })
        .then(async (response) => {
          const educationTerm: EducationTerm = response.data.data;

          const enrollmentResponse =
            await educationEnrollmentsApi.getEducationEnrollments({
              churchId,
              educationId,
              educationTermId,
              take: educationTerm.enrollmentCount,
            });

          const enrollments = enrollmentResponse.data.data;

          const sessionResponse =
            await educationSessionsApi.getEducationSessions({
              churchId,
              educationId,
              educationTermId,
            });

          const sessions = sessionResponse.data.data;

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
            isInProgress,
          })
        );
        if (fetchEducationTerms.fulfilled.match(result)) {
          dispatch(setEducationTerms(result.payload));
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setToastText(error.message);
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      dispatch(setTargetEducationTerm(DEFAULT_EDUCATION_TERM));
      setIsEducationTermInformationShown(false);
    }
  };

  // 기수 수정 페이지 종료
  const onClickEditTermClose = () => {
    const prevEducationTerm = educationTerms.find(
      (educationTerm) => educationTerm.id === targetEducationTerm.id
    );
    if (prevEducationTerm) {
      dispatch(setTargetEducationTerm(prevEducationTerm));
    }
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

  useEffect(() => {
    if (!targetEducationTerm.term) {
      setIsTermSaveEnabled(false);
      return;
    }
    if (!targetEducationTerm.startDate || !targetEducationTerm.endDate) {
      setIsTermSaveEnabled(false);
      return;
    }
    if (!targetEducationTerm.inChargeId) {
      setIsTermSaveEnabled(false);
      return;
    }

    setIsTermSaveEnabled(true);
  }, [targetEducationTerm]);
  // ========== 기수 ==========

  // ========== 회차 ==========

  // 회차 추가 팝업 on/off
  const [isAddEducationSessionShown, setIsAddEducationSessionShown] =
    useState<boolean>(false);

  const [isDirectSession, setIsDirectSession] = useState<boolean>(false);

  const onClickOpenAddEducationSession = (educationTerm?: EducationTerm) => {
    if (isEducationTermInformationShown) {
      setIsEducationTermInformationShown(false);
      setTimeout(() => {
        setIsAddEducationSessionShown(true);
      }, 500);
    } else {
      setIsAddEducationSessionShown(true);
      if (educationTerm) {
        dispatch(setTargetEducationTerm(educationTerm));

        dispatch(
          setTargetEducationSession({
            ...DEFAULT_EDUCATION_SESSION,
            id: new Date().toString(),
          })
        );
        setIsDirectSession(true);
      }
    }
  };

  const onClickCloseAddEducationSession = () => {
    setIsAddEducationSessionShown(false);

    if (!isDirectSession) {
      setTimeout(() => {
        setIsEducationTermInformationShown(true);
      }, 500);
    } else {
      dispatch(setTargetEducationTerm(DEFAULT_EDUCATION_TERM));

      setIsDirectSession(false);
    }
  };

  const onClickAddSessionsDone = async () => {
    try {
      await educationSessionsApi
        .createEducationSession(
          {
            churchId,
            educationId: targetEducationTerm.educationId,
            educationTermId: targetEducationTerm.id,
          },
          {
            title: targetEducationSession.title,
            startDate: targetEducationSession.startDate,
            endDate: targetEducationSession.endDate,
            content: targetEducationSession.content,
            inChargeId: targetEducationSession.inChargeId,
            status: targetEducationSession.status,
            receiverIds: targetEducationSession.receiverIds,
          }
        )
        .then((response) => {
          const newSession = response.data.data;

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
      if (error instanceof Error) {
        setToastText(error.message);
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      dispatch(setTargetEducationSession(DEFAULT_EDUCATION_SESSION));
      setIsAddEducationSessionShown(false);

      if (!isDirectSession) {
        setTimeout(() => {
          setIsEducationTermInformationShown(true);
        }, 500);
      } else {
        dispatch(setTargetEducationTerm(DEFAULT_EDUCATION_TERM));

        setIsDirectSession(false);
      }
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
          const educationSession: EducationSession = response.data.data;

          if (!targetEducationTerm.id) {
            const newTargetEducationTerm = educationTerms.find(
              (term) => term.id === educationTermId
            );

            if (newTargetEducationTerm) {
              dispatch(setTargetEducationTerm(newTargetEducationTerm));
            }
          }

          await educationAttendanceApi
            .getEducationAttendances({
              churchId,
              educationId: targetEducation.id,
              educationTermId,
              sessionId: educationSessionId,
            })
            .then((response) => {
              const newEducationAttendances = response.data.data;

              dispatch(
                setTargetEducationSession({
                  ...educationSession,
                  educationAttendances: newEducationAttendances,
                })
              );
            });
        });
    } catch (error) {
      if (error instanceof Error) {
        setToastText(error.message);
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      if (isEducationTermInformationShown) {
        setIsEducationTermInformationShown(false);
        setTimeout(() => {
          setIsEducationSessionInformationShown(true);
          setIsDirectSession(false);
        }, 500);
      } else {
        setIsDirectSession(true);
        setIsEducationSessionInformationShown(true);
      }
    }
  };

  // 상세 페이지 종료
  const onClickCloseSession = () => {
    setIsEducationSessionInformationShown(false);
    dispatch(setTargetEducationSession(DEFAULT_EDUCATION_SESSION));

    if (!isDirectSession) {
      setTimeout(() => {
        setIsEducationTermInformationShown(true);
      }, 500);
    }

    setIsDirectSession(false);
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
    const prevEducationSession = targetEducationTerm.educationSessions.find(
      (educationSession) => educationSession.id === targetEducationSession.id
    );
    if (prevEducationSession) {
      dispatch(setTargetEducationSession(prevEducationSession));
    }
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

  useEffect(() => {
    if (!getIsWellFormedTitle(targetEducationSession.title)) {
      setIsSessionSaveEnabled(false);
      return;
    }
    if (!targetEducationSession.startDate || !targetEducationSession.endDate) {
      setIsSessionSaveEnabled(false);
      return;
    }
    if (!targetEducationSession.inChargeId) {
      setIsSessionSaveEnabled(false);
      return;
    }

    setIsSessionSaveEnabled(true);
  }, [targetEducationSession]);

  // ========== 회차 ==========

  useEffect(() => {
    if (toastText) {
      setIsToastShown(true);
    }
  }, [toastText]);

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
      term: {
        isTermSaveEnabled,
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
      },
      // 회차
      session: {
        isSessionSaveEnabled,
        isAddEducationSessionShown,
        isEducationSessionInformationShown,
        isEditSessionShown,
        isSessionPopupShown,
        onClickEducationSessionItem,
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
    },
  };

  return (
    <>
      <EducationTermListView {...props} />
      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={toastText}
          backgroundColor={DESTRUCTIVE.LIGHT}
        />
      )}
    </>
  );
};

export default EducationTermList;
