import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import EducationTableView from '@/components/molecules/education/education/education-table.view';
import { EducationTermsApi } from '@/api/education/education-terms.api';
import {
  DEFAULT_EDUCATION,
  DEFAULT_EDUCATION_SESSION,
  DEFAULT_EDUCATION_TERM,
  Education,
  EducationSession,
  EducationTerm,
} from '@/models/education/education';
import { setEducations } from '@/redux/reducers/filter/education-filter-reducer';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { DESTRUCTIVE, MAIN } from '@/constants/styles/color';
import { EducationSessionsApi } from '@/api/education/education-sessions.api';
import { EducationsApi } from '@/api/education/educations.api';
import WrappedPagePopup from '@/components/atoms/common/popup/wrapped-page-popup';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import EducationInformation from '@/components/organisms/education/education/information/education-information';
import AddEducation from '@/components/organisms/education/education/add/add-education';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { getIsWellFormedTitle } from '@/utils/check';
import { setTargetEducation } from '@/redux/reducers/target/target-education-reducer';
import { setTargetEducationTerm } from '@/redux/reducers/target/target-education-term-reducer';
import EducationTermInformation from '@/components/organisms/education/education-term/information/education-term-information';
import AddEducationTerm from '@/components/organisms/education/education-term/add/add-education-term';
import { EducationEnrollmentsApi } from '@/api/education/education-enrollments.api';
import { setTargetEducationSession } from '@/redux/reducers/target/target-education-session-reducer';
import EducationSessionInformation from '@/components/organisms/education/education-session/information/education-session-information';
import AddEducationSession from '@/components/organisms/education/education-session/add/add-education-session';
import { EducationAttendanceApi } from '@/api/education/education-attendance.api';
import { getTranslatedTerm } from '@/utils/translate';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';

export type EducationTableProps = {
  loadEducations: () => void;
};

const EducationTable = ({ loadEducations }: EducationTableProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const t_title = useScopedI18n('title');

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { churchId } = useSelector((state: RootState) => state.church);

  const { educations } = useSelector(
    (state: RootState) => state.educationFilter
  );
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );

  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const educationApi = new EducationsApi(false);
  const educationTermsApi = new EducationTermsApi(false);
  const educationSessionsApi = new EducationSessionsApi(false);
  const educationEnrollmentsApi = new EducationEnrollmentsApi(false);
  const educationAttendanceApi = new EducationAttendanceApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      // 스크롤이 최하단에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight) {
        loadEducations(); // 데이터를 추가로 로드
      }
    }
  };

  // 열려있는 교육 목록
  const [openedEducationIds, setOpenedEducationIds] = useState<string[]>([]);

  // 열려있는 교육 기수 목록
  const [openedTermIds, setOpenedTermIds] = useState<string[]>([]);

  // 교육 열고 닫기
  const onClickEducationChevron = async (value: Education) => {
    try {
      if (openedEducationIds.includes(value.id)) {
        setOpenedEducationIds(
          openedEducationIds.filter((id) => id !== value.id)
        );
      } else {
        if (!value.educationTerms) {
          const response = await educationTermsApi.getEducationTerms({
            churchId,
            educationId: value.id,
          });

          const newEducationTerms = response.data.data;

          const newEducations = educations.map((education) => {
            if (education.id === value.id) {
              return {
                ...education,
                educationTerms: newEducationTerms,
              };
            } else {
              return education;
            }
          });

          dispatch(setEducations(newEducations));
        }
        setOpenedEducationIds([...openedEducationIds, value.id]);
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.LIGHT));
        dispatch(setIsToastShown(true));
      } else setThrownError(new Error(String(error)));
    }
  };

  // 교육 기수 열고 닫기
  const onClickTermChevron = async (value: EducationTerm) => {
    try {
      if (openedTermIds.includes(value.id)) {
        setOpenedTermIds(openedTermIds.filter((id) => id !== value.id));
      } else {
        if (!value.educationSessions) {
          const response = await educationSessionsApi.getEducationSessions({
            churchId,
            educationId: value.educationId,
            educationTermId: value.id,
          });

          const newEducationSessions = response.data.data;

          const newEducations = educations.map((education) => {
            if (education.id === value.educationId) {
              return {
                ...education,
                educationTerms: education.educationTerms?.map((term) => {
                  if (term.id === value.id) {
                    return {
                      ...term,
                      educationSessions: newEducationSessions,
                    };
                  } else {
                    return term;
                  }
                }),
              };
            } else {
              return education;
            }
          });

          dispatch(setEducations(newEducations));
        }
        setOpenedTermIds([...openedTermIds, value.id]);
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.LIGHT));
        dispatch(setIsToastShown(true));
      } else setThrownError(new Error(String(error)));
    }
  };

  // ------------------------- 교육 ---------------------------

  // 교인 상세정보 팝업 On/Off
  const [isEducationInformationShown, setIsEducationInformationShown] =
    useState<boolean>(false);

  const [isEducationSaveEnabled, setIsEducationSaveEnabled] =
    useState<boolean>(false);

  // 삭제 확인 팝업
  const [isEducationDeletePopupShown, setIsEducationDeletePopupShown] =
    useState<boolean>(false);

  // 개인정보 수정 모달
  const [isEducationEditShown, setIsEducationEditShown] =
    useState<boolean>(false);

  const onClickDeleteEducationConfirmOpen = () => {
    setIsEducationDeletePopupShown(true);
  };

  const onClickDeleteEducationConfirmClose = () => {
    setIsEducationDeletePopupShown(false);
  };

  // 목록에서 교육을 선택하여 상세 페이지로 이동
  const onClickEducationItem = async (education: Education) => {
    try {
      const response = await educationApi.getEducation({
        churchId,
        educationId: education.id,
      });

      const termResponse = await educationTermsApi.getEducationTerms({
        churchId,
        educationId: education.id,
      });
      const newEducation = response.data;
      const educationTerms = termResponse.data.data;

      dispatch(setTargetEducation({ ...newEducation, educationTerms }));
      setIsEducationInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickEducationInformationClose = () => {
    setIsEducationInformationShown(false);
    dispatch(setTargetEducation(DEFAULT_EDUCATION));
  };

  // 교인 삭제하기
  const onClickDeleteEducation = async () => {
    try {
      await educationApi.deleteEducation({
        churchId,
        educationId: targetEducation.id,
      });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetEducation(DEFAULT_EDUCATION));
      setIsEducationInformationShown(false);
    }
  };

  const onClickEditEducationOpen = () => {
    dispatch(setTargetEducation(targetEducation));
    setIsEducationEditShown(true);
  };

  const onClickEditEducationClose = async () => {
    setIsEducationEditShown(false);
    const response = await educationApi.getEducation({
      churchId,
      educationId: targetEducation.id,
    });
    const newEducation = response.data;
    dispatch(
      setTargetEducation({
        ...newEducation,
        educationTerms: targetEducation.educationTerms,
      })
    );
  };

  const onClickEditEducationDone = async () => {
    try {
      const prev = educations.find(
        (education) => education.id === targetEducation.id
      );
      await educationApi
        .editEducation(
          { churchId, educationId: targetEducation.id },
          {
            name:
              prev?.name !== targetEducation.name
                ? targetEducation.name
                : undefined,
            description: targetEducation.description || undefined,
          }
        )
        .then((response) => {
          const newEducation = response.data;
          dispatch(
            setTargetEducation({
              ...newEducation,
              educationTerms: targetEducation?.educationTerms,
            })
          );
          setIsEducationEditShown(false);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setIsToastShown(true));
      dispatch(setToastText(t_popup('saveComplete')));
    }
  };

  useEffect(() => {
    setIsEducationDeletePopupShown(false);
  }, [targetEducation]);

  useEffect(() => {
    if (!getIsWellFormedTitle(targetEducation.name)) {
      setIsEducationSaveEnabled(false);
      return;
    }

    setIsEducationSaveEnabled(true);
  }, [targetEducation]);
  // ------------------------- 교육 ---------------------------

  // ------------------------- 교육 기수 ---------------------------

  // 교인 상세정보 팝업 On/Off
  const [isEducationTermInformationShown, setIsEducationTermInformationShown] =
    useState<boolean>(false);

  const [isEducationTermSaveEnabled, setIsEducationTermSaveEnabled] =
    useState<boolean>(false);

  // 삭제 확인 팝업
  const [isEducationTermDeletePopupShown, setIsEducationTermDeletePopupShown] =
    useState<boolean>(false);

  // 개인정보 수정 모달
  const [isEducationTermEditShown, setIsEducationTermEditShown] =
    useState<boolean>(false);

  const onClickDeleteEducationTermConfirmOpen = () => {
    setIsEducationTermDeletePopupShown(true);
  };

  const onClickDeleteEducationTermConfirmClose = () => {
    setIsEducationTermDeletePopupShown(false);
  };

  // 목록에서 교육을 선택하여 상세 페이지로 이동
  const onClickEducationTermItem = async (
    education: Education,
    educationTerm: EducationTerm
  ) => {
    try {
      const response = await educationTermsApi.getEducationTerm({
        churchId,
        educationId: educationTerm.educationId,
        educationTermId: educationTerm.id,
      });

      const sessionResponse = await educationSessionsApi.getEducationSessions({
        churchId,
        educationId: educationTerm.educationId,
        educationTermId: educationTerm.id,
      });
      const enrollmentResponse =
        await educationEnrollmentsApi.getEducationEnrollments({
          churchId,
          educationId: educationTerm.educationId,
          educationTermId: educationTerm.id,
        });

      const newEducationTerm = response.data.data;
      const educationSessions = sessionResponse.data.data;
      const educationEnrollments = enrollmentResponse.data.data;

      dispatch(setTargetEducation(education));
      dispatch(
        setTargetEducationTerm({
          ...newEducationTerm,
          educationSessions,
          educationEnrollments,
        })
      );
      setIsEducationTermInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickEducationTermInformationClose = () => {
    setIsEducationTermInformationShown(false);
    dispatch(setTargetEducationTerm(DEFAULT_EDUCATION_TERM));
  };

  // 교인 삭제하기
  const onClickDeleteEducationTerm = async () => {
    try {
      await educationTermsApi.deleteEducationTerm({
        churchId,
        educationId: targetEducationTerm.educationId,
        educationTermId: targetEducationTerm.id,
      });

      const newEducations = educations.map((education) => {
        if (education.id === targetEducationTerm.educationId) {
          return {
            ...education,
            educationTerms: education.educationTerms?.filter(
              (term) => term.id !== targetEducationTerm.id
            ),
          };
        } else {
          return education;
        }
      });
      dispatch(setEducations(newEducations));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetEducationTerm(DEFAULT_EDUCATION_TERM));
      setIsEducationTermInformationShown(false);
    }
  };

  const onClickEditEducationTermOpen = () => {
    dispatch(setTargetEducationTerm(targetEducationTerm));
    setIsEducationTermEditShown(true);
  };

  const onClickEditEducationTermClose = async () => {
    setIsEducationTermEditShown(false);
    const response = await educationTermsApi.getEducationTerm({
      churchId,
      educationId: targetEducationTerm.educationId,
      educationTermId: targetEducationTerm.id,
    });
    const newEducationTerm = response.data.data;
    dispatch(
      setTargetEducationTerm({
        ...newEducationTerm,
        educationSessions: targetEducationTerm.educationSessions,
        educationEnrollments: targetEducationTerm.educationEnrollments,
      })
    );
  };

  const onClickEditEducationTermDone = async () => {
    try {
      const prev = targetEducation.educationTerms?.find(
        (term) => term.id === targetEducationTerm.id
      );

      const response = await educationTermsApi.editEducationTerm(
        {
          churchId,
          educationId: targetEducationTerm.educationId,
          educationTermId: targetEducationTerm.id,
        },
        {
          term:
            prev?.term !== targetEducationTerm.term
              ? targetEducationTerm.term
              : undefined,
          startDate: targetEducationTerm.startDate || undefined,
          endDate: targetEducationTerm.endDate || undefined,
          inChargeId: targetEducationTerm.inChargeId || undefined,
          content: targetEducationTerm.content || undefined,
        }
      );

      const newEducationTerm = {
        ...response.data.data,
        educationSessions: targetEducationTerm.educationSessions,
        educationEnrollments: targetEducationTerm.educationEnrollments,
      };
      const newEducations = educations.map((education) => {
        if (education.id === targetEducationTerm.educationId) {
          return {
            ...education,
            educationTerms: education.educationTerms?.map((term) => {
              if (term.id === targetEducationTerm.id) {
                return newEducationTerm;
              } else {
                return term;
              }
            }),
          };
        } else {
          return education;
        }
      });
      dispatch(setTargetEducationTerm(newEducationTerm));
      dispatch(setEducations(newEducations));

      setIsEducationTermEditShown(false);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setIsToastShown(true));
      dispatch(setToastText(t_popup('saveComplete')));
    }
  };

  useEffect(() => {
    setIsEducationTermDeletePopupShown(false);
  }, [targetEducationTerm]);

  useEffect(() => {
    if (!getIsWellFormedTitle(targetEducationTerm.term)) {
      setIsEducationTermSaveEnabled(false);
      return;
    }

    if (!targetEducationTerm.inChargeId) {
      setIsEducationTermSaveEnabled(false);
      return;
    }

    setIsEducationTermSaveEnabled(true);
  }, [targetEducationTerm]);
  // ------------------------- 교육 기수 ---------------------------

  // ------------------------- 교육 회차 ---------------------------

  // 교인 상세정보 팝업 On/Off
  const [
    isEducationSessionInformationShown,
    setIsEducationSessionInformationShown,
  ] = useState<boolean>(false);

  const [isEducationSessionSaveEnabled, setIsEducationSessionSaveEnabled] =
    useState<boolean>(false);

  // 삭제 확인 팝업
  const [
    isEducationSessionDeletePopupShown,
    setIsEducationSessionDeletePopupShown,
  ] = useState<boolean>(false);

  // 개인정보 수정 모달
  const [isEducationSessionEditShown, setIsEducationSessionEditShown] =
    useState<boolean>(false);

  const onClickDeleteEducationSessionConfirmOpen = () => {
    setIsEducationSessionDeletePopupShown(true);
  };

  const onClickDeleteEducationSessionConfirmClose = () => {
    setIsEducationSessionDeletePopupShown(false);
  };

  // 목록에서 교육을 선택하여 상세 페이지로 이동
  const onClickEducationSessionItem = async (
    education: Education,
    educationTerm: EducationTerm,
    educationSession: EducationSession
  ) => {
    try {
      const response = await educationSessionsApi.getEducationSession({
        churchId,
        educationId: educationTerm.educationId,
        educationTermId: educationTerm.id,
        educationSessionId: educationSession.id,
      });

      const attendanceResponse =
        await educationAttendanceApi.getEducationAttendances({
          churchId,
          educationId: educationTerm.educationId,
          educationTermId: educationTerm.id,
          sessionId: educationSession.id,
        });

      const newEducationSession = response.data.data;
      const educationAttendances = attendanceResponse.data.data;

      dispatch(setTargetEducation(education));
      dispatch(setTargetEducationTerm(educationTerm));
      dispatch(
        setTargetEducationSession({
          ...newEducationSession,
          educationAttendances,
        })
      );
      setIsEducationSessionInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickEducationSessionInformationClose = () => {
    setIsEducationSessionInformationShown(false);
    dispatch(setTargetEducationSession(DEFAULT_EDUCATION_SESSION));
  };

  // 교인 삭제하기
  const onClickDeleteEducationSession = async () => {
    try {
      await educationSessionsApi.deleteEducationSession({
        churchId,
        educationId: targetEducationTerm.educationId,
        educationTermId: targetEducationTerm.id,
        educationSessionId: targetEducationSession.id,
      });

      const newEducations = educations.map((education) => {
        if (education.id === targetEducationTerm.educationId) {
          return {
            ...education,
            educationTerms: education.educationTerms?.map((term) => {
              if (term.id === targetEducationTerm.id) {
                return {
                  ...term,
                  educationSessions: term.educationSessions?.filter(
                    (session) => session.id !== targetEducationSession.id
                  ),
                };
              } else {
                return term;
              }
            }),
          };
        } else {
          return education;
        }
      });
      dispatch(setEducations(newEducations));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetEducationSession(DEFAULT_EDUCATION_SESSION));
      setIsEducationSessionInformationShown(false);
    }
  };

  const onClickEditEducationSessionOpen = () => {
    dispatch(setTargetEducationSession(targetEducationSession));
    setIsEducationSessionEditShown(true);
  };

  const onClickEditEducationSessionClose = async () => {
    setIsEducationSessionEditShown(false);
    const response = await educationSessionsApi.getEducationSession({
      churchId,
      educationId: targetEducationTerm.educationId,
      educationTermId: targetEducationTerm.id,
      educationSessionId: targetEducationSession.id,
    });
    const newEducationSession = response.data.data;
    dispatch(
      setTargetEducationSession({
        ...newEducationSession,
        educationAttendances: targetEducationSession.educationAttendances,
      })
    );
  };

  const onClickEditEducationSessionDone = async () => {
    try {
      const response = await educationSessionsApi.editEducationSession(
        {
          churchId,
          educationId: targetEducationTerm.educationId,
          educationTermId: targetEducationTerm.id,
          educationSessionId: targetEducationSession.id,
        },
        {
          title: targetEducationSession.title || undefined,
          startDate: targetEducationSession.startDate || undefined,
          endDate: targetEducationSession.endDate || undefined,
          inChargeId: targetEducationSession.inChargeId || undefined,
          content: targetEducationSession.content || undefined,
        }
      );
      const newEducationSession = {
        ...response.data.data,
        educationAttendances: targetEducationSession.educationAttendances,
      };
      const newEducations = educations.map((education) => {
        if (education.id === targetEducationTerm.educationId) {
          return {
            ...education,
            educationTerms: education.educationTerms?.map((term) => {
              if (term.id === targetEducationTerm.id) {
                return {
                  ...term,
                  educationSessions: term.educationSessions?.map((session) => {
                    if (session.id === targetEducationSession.id) {
                      return newEducationSession;
                    }
                  }),
                };
              } else {
                return term;
              }
            }),
          };
        } else {
          return education;
        }
      });
      dispatch(setTargetEducationSession(newEducationSession));
      dispatch(setEducations(newEducations));
      setIsEducationSessionEditShown(false);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setIsToastShown(true));
      dispatch(setToastText(t_popup('saveComplete')));
    }
  };

  useEffect(() => {
    setIsEducationSessionDeletePopupShown(false);
  }, [targetEducationSession]);

  useEffect(() => {
    if (!getIsWellFormedTitle(targetEducationSession.title)) {
      setIsEducationSessionSaveEnabled(false);
      return;
    }

    if (!targetEducationSession.inChargeId) {
      setIsEducationSessionSaveEnabled(false);
      return;
    }

    setIsEducationSessionSaveEnabled(true);
  }, [targetEducationSession]);
  // ------------------------- 교육 회차 ---------------------------

  const props = {
    scrollRef,
    onScroll,
    openedEducationIds,
    openedTermIds,
    onClickEducationChevron,
    onClickTermChevron,
    onClickEducationItem,
    onClickEducationTermItem,
    onClickEducationSessionItem,
  };

  return (
    <>
      <EducationTableView {...props} />

      {/* 교육 상세정보 팝업*/}
      <WrappedPagePopup
        width={1000}
        keyboardDisabled={true}
        isShow={isEducationInformationShown}
        onClickClose={onClickEducationInformationClose}
        headerTitle={targetEducation?.name}
        headerDescription={targetEducation?.description}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        onClickDone={onClickEditEducationOpen}
        onClickCancel={onClickDeleteEducationConfirmOpen}
      >
        <>
          {/* 삭제 확인 팝업 */}
          <ConfirmPopup
            title={t_popup('deleteEducationTitle')}
            body={t_popup('deleteEducationBody')}
            buttonNum={2}
            isShow={isEducationDeletePopupShown}
            onClickLeftButton={onClickDeleteEducationConfirmClose}
            onClickRightButton={() => {
              onClickDeleteEducation();
              onClickDeleteEducationConfirmClose();
            }}
            leftButtonText={t_button('cancel')}
            rightButtonText={t_button('delete')}
          />
          <EducationInformation />
        </>
      </WrappedPagePopup>

      {/* 교육 수정 팝업*/}
      <WrappedPagePopup
        width={1000}
        keyboardDisabled={true}
        isShow={isEducationEditShown}
        onClickClose={onClickEditEducationClose}
        onClickCancel={onClickEditEducationClose}
        onClickDone={onClickEditEducationDone}
        headerTitle={t_title('editEducation')}
        doneBackgroundColor={isEducationSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isEducationSaveEnabled}
      >
        <AddEducation />
      </WrappedPagePopup>

      {/* 교육기수 상세정보 팝업*/}
      <WrappedPagePopup
        width={1000}
        keyboardDisabled={true}
        isShow={isEducationTermInformationShown}
        onClickClose={onClickEducationTermInformationClose}
        headerTitle={`${targetEducationTerm.educationName} - ${getTranslatedTerm(locale, targetEducationTerm.term)}`}
        // headerDescription={targetEducationTerm?.description}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        onClickDone={onClickEditEducationTermOpen}
        onClickCancel={onClickDeleteEducationTermConfirmOpen}
      >
        <>
          {/* 삭제 확인 팝업 */}
          <ConfirmPopup
            title={t_popup('deleteEducationTermTitle')}
            body={t_popup('deleteEducationTermBody')}
            buttonNum={2}
            isShow={isEducationTermDeletePopupShown}
            onClickLeftButton={onClickDeleteEducationTermConfirmClose}
            onClickRightButton={() => {
              onClickDeleteEducationTerm();
              onClickDeleteEducationTermConfirmClose();
            }}
            leftButtonText={t_button('cancel')}
            rightButtonText={t_button('delete')}
          />
          <EducationTermInformation />
        </>
      </WrappedPagePopup>

      {/* 교육기수 수정 팝업*/}
      <WrappedPagePopup
        width={1000}
        keyboardDisabled={true}
        isShow={isEducationTermEditShown}
        onClickClose={onClickEditEducationTermClose}
        onClickCancel={onClickEditEducationTermClose}
        onClickDone={onClickEditEducationTermDone}
        headerTitle={t_title('editEducationTerm')}
        doneBackgroundColor={
          isEducationTermSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT
        }
        doneDisabled={!isEducationTermSaveEnabled}
      >
        <AddEducationTerm />
      </WrappedPagePopup>

      {/* 교육회차 상세정보 팝업*/}
      <WrappedPagePopup
        width={1000}
        keyboardDisabled={true}
        isShow={isEducationSessionInformationShown}
        onClickClose={onClickEducationSessionInformationClose}
        headerTitle={`${targetEducationTerm.educationName} - ${getTranslatedTerm(locale, targetEducationTerm.term)} - ${targetEducationSession.session}${t('session')}`}
        // headerDescription={targetEducationSession?.description}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        onClickDone={onClickEditEducationSessionOpen}
        onClickCancel={onClickDeleteEducationSessionConfirmOpen}
      >
        <>
          {/* 삭제 확인 팝업 */}
          <ConfirmPopup
            title={t_popup('deleteEducationSessionTitle')}
            body={t_popup('deleteEducationSessionBody')}
            buttonNum={2}
            isShow={isEducationSessionDeletePopupShown}
            onClickLeftButton={onClickDeleteEducationSessionConfirmClose}
            onClickRightButton={() => {
              onClickDeleteEducationSession();
              onClickDeleteEducationSessionConfirmClose();
            }}
            leftButtonText={t_button('cancel')}
            rightButtonText={t_button('delete')}
          />
          <EducationSessionInformation />
        </>
      </WrappedPagePopup>

      {/* 교육회차 수정 팝업*/}
      <WrappedPagePopup
        width={1000}
        keyboardDisabled={true}
        isShow={isEducationSessionEditShown}
        onClickClose={onClickEditEducationSessionClose}
        onClickCancel={onClickEditEducationSessionClose}
        onClickDone={onClickEditEducationSessionDone}
        headerTitle={t_title('editEducationSession')}
        doneBackgroundColor={
          isEducationSessionSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT
        }
        doneDisabled={!isEducationSessionSaveEnabled}
      >
        <AddEducationSession />
      </WrappedPagePopup>
    </>
  );
};

export default EducationTable;
