import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  DEFAULT_EDUCATION_SESSION,
  DEFAULT_EDUCATION_TERM,
  Education,
  EducationSession,
  EducationTerm,
} from '@/models/education/education';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { DESTRUCTIVE, MAIN } from '@/constants/styles/color';
import { EducationSessionsApi } from '@/api/education/education-sessions.api';
import EducationTermTableView from '@/components/molecules/education/education-term/education-term-table.view';
import { setTargetEducation } from '@/redux/reducers/target/target-education-reducer';
import { setTargetEducationTerm } from '@/redux/reducers/target/target-education-term-reducer';
import { setEducations } from '@/redux/reducers/filter/education-filter-reducer';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getFullStringFromDate,
} from '@/utils/date';
import { getIsWellFormedTitle } from '@/utils/check';
import { TASK_STATUS } from '@/constants/status/status';
import { setEducationTerms } from '@/redux/reducers/filter/education-term-filter-reducer';
import { setTargetEducationSession } from '@/redux/reducers/target/target-education-session-reducer';
import { EducationTermsApi } from '@/api/education/education-terms.api';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import WrappedPagePopup from '@/components/atoms/common/popup/wrapped-page-popup';
import { getTranslatedTerm } from '@/utils/translate';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import EducationTermInformation from '@/components/organisms/education/education-term/information/education-term-information';
import AddEducationTerm from '@/components/organisms/education/education-term/add/add-education-term';
import EducationSessionInformation from '@/components/organisms/education/education-session/information/education-session-information';
import AddEducationSession from '@/components/organisms/education/education-session/add/add-education-session';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';

export type EducationTermTableProps = {};

const EducationTermTable = ({}: EducationTermTableProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const t_title = useScopedI18n('title');

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

  const educationTermsApi = new EducationTermsApi(false);
  const educationSessionsApi = new EducationSessionsApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  // 열려있는 교육 기수 목록
  const [openedTermIds, setOpenedTermIds] = useState<string[]>([]);

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

          const newEducation = {
            ...targetEducation,
            educationTerms: targetEducation.educationTerms?.map((term) => {
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

          dispatch(setTargetEducation(newEducation));
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

      const newEducationTerm = response.data.data;

      dispatch(setTargetEducation(education));
      dispatch(
        setTargetEducationTerm({
          ...newEducationTerm,
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
          startDate: getDateStringFromDate(
            getDateFromDateString(targetEducationTerm.startDate)
          ),
          endDate: getDateStringFromDate(
            getDateFromDateString(targetEducationTerm.endDate)
          ),
          inChargeId: targetEducationTerm.inChargeId || undefined,
          location: targetEducationTerm.location || undefined,
        }
      );

      const reports = targetEducation.educationTerms.find(
        (term) => term.id === targetEducationTerm.id
      )?.reports;

      const receiverIds = reports?.map((report) => report.receiver.id) || [];

      const addReceiverIds = targetEducationTerm.receiverIds?.filter(
        (receiverId) => !receiverIds.includes(receiverId)
      );
      const deleteReceiverIds =
        receiverIds?.filter(
          (receiverId) => !targetEducationTerm.receiverIds?.includes(receiverId)
        ) || [];

      if (addReceiverIds?.length > 0) {
        await educationTermsApi.addReceivers(
          {
            churchId,
            educationId: targetEducation.id,
            educationTermId: targetEducationTerm.id,
          },
          { receiverIds: addReceiverIds }
        );
      }

      if (deleteReceiverIds?.length > 0) {
        await educationTermsApi.deleteReceivers(
          {
            churchId,
            educationId: targetEducation.id,
            educationTermId: targetEducationTerm.id,
          },
          { receiverIds: deleteReceiverIds }
        );
      }

      const termResponse = await educationTermsApi.getEducationTerm({
        churchId,
        educationId: targetEducation.id,
        educationTermId: targetEducationTerm.id,
      });

      const newEducationTerm = {
        ...termResponse.data.data,
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

  const onChangeTermStatus = (status: TASK_STATUS) => {
    try {
      educationTermsApi
        .editEducationTerm(
          {
            churchId,
            educationId: targetEducation.id,
            educationTermId: targetEducationTerm.id,
          },
          { status: status }
        )
        .then((response) => {
          const newEducationTerm = response.data.data;

          dispatch(
            setTargetEducationTerm({
              ...targetEducationTerm,
              status: status,
            })
          );

          const newEducationTerms = targetEducation.educationTerms.map(
            (term) => {
              return term.id !== newEducationTerm.id
                ? term
                : { ...term, status: status };
            }
          );

          dispatch(setEducationTerms(newEducationTerms));

          const newEducations = educations.map((education) => {
            if (education.id === targetEducationTerm.educationId) {
              return {
                ...education,
                educationTerms: newEducationTerms,
              };
            } else {
              return education;
            }
          });

          dispatch(setEducations(newEducations));
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  // ===== status =====
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
      const newEducationSession = response.data.data;

      dispatch(setTargetEducation(education));
      dispatch(setTargetEducationTerm(educationTerm));
      dispatch(
        setTargetEducationSession({
          ...newEducationSession,
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
      const prev = targetEducationTerm.educationSessions?.find(
        (session) => session.id === targetEducationSession.id
      );

      const response = await educationSessionsApi.editEducationSession(
        {
          churchId,
          educationId: targetEducationTerm.educationId,
          educationTermId: targetEducationTerm.id,
          educationSessionId: targetEducationSession.id,
        },
        {
          title: targetEducationSession.title || undefined,
          startDate:
            getFullStringFromDate(
              getDateFromDateString(targetEducationSession.startDate)
            ) || undefined,
          endDate:
            getFullStringFromDate(
              getDateFromDateString(targetEducationSession.endDate)
            ) || undefined,
          inChargeId: targetEducationSession.inChargeId || undefined,
          content: targetEducationSession.content || undefined,
        }
      );

      const reports = prev?.reports;

      const receiverIds = reports?.map((report) => report.receiver.id) || [];

      const addReceiverIds = targetEducationSession.receiverIds?.filter(
        (receiverId) => !receiverIds.includes(receiverId)
      );
      const deleteReceiverIds =
        receiverIds?.filter(
          (receiverId) =>
            !targetEducationSession.receiverIds?.includes(receiverId)
        ) || [];

      if (addReceiverIds?.length > 0) {
        await educationSessionsApi.addReceivers(
          {
            churchId,
            educationId: targetEducation.id,
            educationTermId: targetEducationTerm.id,
            educationSessionId: targetEducationSession.id,
          },
          { receiverIds: addReceiverIds }
        );
      }

      if (deleteReceiverIds?.length > 0) {
        await educationSessionsApi.deleteReceivers(
          {
            churchId,
            educationId: targetEducation.id,
            educationTermId: targetEducationTerm.id,
            educationSessionId: targetEducationSession.id,
          },
          { receiverIds: deleteReceiverIds }
        );
      }

      const sessionResponse = await educationSessionsApi.getEducationSession({
        churchId,
        educationId: targetEducation.id,
        educationTermId: targetEducationTerm.id,
        educationSessionId: targetEducationSession.id,
      });

      const newEducationSession = {
        ...sessionResponse.data.data,
        educationAttendances: targetEducationSession.educationAttendances,
      };

      const newEducationTerm = {
        ...targetEducationTerm,
        educationSessions: targetEducationTerm.educationSessions.map(
          (session) => {
            if (session.id === targetEducationTerm.id) {
              return newEducationSession;
            } else {
              return session;
            }
          }
        ),
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

      dispatch(setTargetEducationSession(newEducationSession));
      dispatch(setTargetEducationTerm(newEducationTerm));
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

  const onChangeSessionStatus = (status: TASK_STATUS) => {
    try {
      educationSessionsApi
        .editEducationSession(
          {
            churchId,
            educationId: targetEducation.id,
            educationTermId: targetEducationTerm.id,
            educationSessionId: targetEducationSession.id,
          },
          { status: status }
        )
        .then((response) => {
          const newEducationSession: EducationSession = response.data.data;

          dispatch(
            setTargetEducationSession({
              ...targetEducationSession,
              status: status,
            })
          );

          const newEducationSessions: EducationSession[] =
            targetEducationTerm.educationSessions.map((session) => {
              if (session.id === newEducationSession.id) {
                return newEducationSession;
              } else {
                return session;
              }
            });

          const newTargetEducationTerm = {
            ...targetEducationTerm,
            educationSessions: newEducationSessions,
          };
          dispatch(setTargetEducationTerm(newTargetEducationTerm));

          const newEducationTerms = targetEducation.educationTerms.map(
            (term) =>
              term.id === newTargetEducationTerm.id
                ? newTargetEducationTerm
                : term
          );

          const newEducations = educations.map((education) => {
            if (education.id === targetEducation.id) {
              return {
                ...education,
                educationTerms: newEducationTerms,
              };
            } else {
              return education;
            }
          });
          dispatch(setEducations(newEducations));
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  // ------------------------- 교육 회차 ---------------------------

  const props = {
    openedTermIds,
    onClickTermChevron,
    onClickEducationTermItem,
    onClickEducationSessionItem,
  };

  return (
    <>
      <EducationTermTableView {...props} />

      {/* 교육기수 상세정보 팝업*/}
      <WrappedPagePopup
        keyboardDisabled={true}
        isShow={isEducationTermInformationShown}
        onClickClose={onClickEducationTermInformationClose}
        headerTitle={`${targetEducationTerm.educationName} - ${getTranslatedTerm(locale, targetEducationTerm.term)}`}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        onClickDone={onClickEditEducationTermOpen}
        onClickCancel={onClickDeleteEducationTermConfirmOpen}
        stageTwoTop={40}
        stageThreeTop={250}
        status={targetEducationTerm.status}
        onChangeStatus={onChangeTermStatus}
        inCharge={targetEducationTerm.inCharge}
        startDate={targetEducationTerm.startDate}
        endDate={targetEducationTerm.endDate}
        closeText={t_button('backToEducation')}
      >
        {(scrollRef) => (
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
            <EducationTermInformation scrollRef={scrollRef} />
          </>
        )}
      </WrappedPagePopup>

      {/* 교육기수 수정 팝업*/}
      <WrappedPagePopup
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
        closeText={t_button('backToEducationTerm')}
      >
        <AddEducationTerm />
      </WrappedPagePopup>

      {/* 교육회차 상세정보 팝업*/}
      <WrappedPagePopup
        keyboardDisabled={true}
        isShow={isEducationSessionInformationShown}
        onClickClose={onClickEducationSessionInformationClose}
        headerTitle={`${targetEducationTerm.educationName} - ${getTranslatedTerm(locale, targetEducationTerm.term)} - ${targetEducationSession.session}${t('session')} ${targetEducationSession.title}`}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        onClickDone={onClickEditEducationSessionOpen}
        onClickCancel={onClickDeleteEducationSessionConfirmOpen}
        stageTwoTop={40}
        stageThreeTop={250}
        status={targetEducationSession.status}
        onChangeStatus={onChangeSessionStatus}
        inCharge={targetEducationSession.inCharge}
        startDate={targetEducationSession.startDate}
        endDate={targetEducationSession.endDate}
        closeText={t_button('backToEducation')}
      >
        {(scrollRef) => (
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
            <EducationSessionInformation scrollRef={scrollRef} />
          </>
        )}
      </WrappedPagePopup>

      {/* 교육회차 수정 팝업*/}
      <WrappedPagePopup
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
        closeText={t_button('backToEducationTerm')}
      >
        <AddEducationSession />
      </WrappedPagePopup>
    </>
  );
};

export default EducationTermTable;
