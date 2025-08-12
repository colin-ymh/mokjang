import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  DEFAULT_EDUCATION_SESSION,
  Education,
  EducationSession,
  EducationTerm,
} from '@/models/education/education';
import {
  setIsToastShown,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { MAIN } from '@/constants/styles/color';
import { EducationSessionsApi } from '@/api/education/education-sessions.api';
import { EducationsApi } from '@/api/education/educations.api';
import { setTargetEducation } from '@/redux/reducers/target/target-education-reducer';
import { setTargetEducationTerm } from '@/redux/reducers/target/target-education-term-reducer';
import { setEducations } from '@/redux/reducers/filter/education-filter-reducer';
import { getIsWellFormedTitle } from '@/utils/check';
import { TASK_STATUS } from '@/constants/status/status';
import { setTargetEducationSession } from '@/redux/reducers/target/target-education-session-reducer';
import { EducationTermsApi } from '@/api/education/education-terms.api';
import { EducationEnrollmentsApi } from '@/api/education/education-enrollments.api';
import { EducationAttendanceApi } from '@/api/education/education-attendance.api';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import WrappedPagePopup from '@/components/atoms/common/popup/wrapped-page-popup';
import { getTranslatedTerm } from '@/utils/translate';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import EducationSessionInformation from '@/components/organisms/education/education-session/information/education-session-information';
import AddEducationSession from '@/components/organisms/education/education-session/add/add-education-session';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import EducationSessionTableView from '@/components/molecules/education/education-session/education-session-table.view';
import { getDateFromDateString, getFullStringFromDate } from '@/utils/date';

export type EducationTermTableProps = {};

const EducationSessionTable = ({}: EducationTermTableProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

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
      // dispatch(setTargetEducationTerm(educationTerm));
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
    onClickEducationSessionItem,
  };

  return (
    <>
      <EducationSessionTableView {...props} />

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
        closeText={t_button('backToEducationTerm')}
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
        closeText={t_button('backToEducationSession')}
      >
        <AddEducationSession />
      </WrappedPagePopup>
    </>
  );
};

export default EducationSessionTable;
