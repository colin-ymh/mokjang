import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { EducationTermsApi } from '@/api/education/education-terms.api';
import React, { useEffect, useState } from 'react';
import {
  DEFAULT_EDUCATION_SESSION,
  EducationEnrollment,
} from '@/models/education/education';
import { setTargetEducationTerm } from '@/redux/reducers/target/target-education-term-reducer';
import { setEducationTerms } from '@/redux/reducers/filter/education-term-filter-reducer';
import EducationTermInformationView from '@/components/organisms/education/education-term/information/education-term-information.view';
import { EducationEnrollmentsApi } from '@/api/education/education-enrollments.api';

import {
  EDUCATION_ENROLLMENT_STATUS,
  TASK_STATUS,
} from '@/constants/status/status';
import { EDUCATION_TERM_CONTENT_ID } from '@/constants/layout/content';
import { Member } from '@/models/member/member';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { BLACK, DESTRUCTIVE, MAIN } from '@/constants/styles/color';
import { useScopedI18n } from '../../../../../../locales/client';
import { setEducations } from '@/redux/reducers/filter/education-filter-reducer';
import { getDateFromDateString, getFullStringFromDate } from '@/utils/date';
import { setTargetEducationSession } from '@/redux/reducers/target/target-education-session-reducer';
import { getIsWellFormedTitle } from '@/utils/check';
import { EducationSessionsApi } from '@/api/education/education-sessions.api';
import WrappedPagePopup from '@/components/atoms/common/popup/wrapped-page-popup';
import AddEducationSession from '@/components/organisms/education/education-session/add/add-education-session';

type EducationTermInformationProps = {};

const EducationTermInformation = ({}: EducationTermInformationProps) => {
  const t_popup = useScopedI18n('popup');
  const t_title = useScopedI18n('title');
  const t_button = useScopedI18n('button');
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
  const { churchId } = useSelector((state: RootState) => state.church);

  const dispatch = useDispatch<AppDispatch>();
  const educationTermsApi = new EducationTermsApi(false);
  const educationEnrollmentsApi = new EducationEnrollmentsApi(false);
  const educationSessionsApi = new EducationSessionsApi(false);

  const [headerBar, setHeaderBar] = useState<EDUCATION_TERM_CONTENT_ID>(
    EDUCATION_TERM_CONTENT_ID.SESSIONS
  );

  const [page, setPage] = useState<number>(1);

  // 선택된 교인 목록
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  // 그룹에 교인 다중 추가를 위한 모달 활성화 여부
  const [isAddModalShown, setIsAddModalShown] = useState<boolean>(false);

  // 개인정보 수정 모달
  const [isEducationSessionAddShown, setIsEducationSessionAddShown] =
    useState<boolean>(false);

  const [isEducationSessionSaveEnabled, setIsEducationSessionSaveEnabled] =
    useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // -------- enrollment ---------
  const fetchEnrollments = async () => {
    try {
      const response = await educationEnrollmentsApi.getEducationEnrollments({
        churchId,
        educationId: targetEducationTerm.educationId,
        educationTermId: targetEducationTerm.id,
        page,
        take: 10,
      });

      const newEnrollments: EducationEnrollment[] = response.data.data;

      if (!newEnrollments || newEnrollments.length === 0) return;

      const existingEnrollments =
        targetEducationTerm.educationEnrollments || [];

      // 중복 ID 제거
      const existingIds = new Set(existingEnrollments.map((e) => e.id));
      const filteredNewEnrollments = newEnrollments.filter(
        (e) => !existingIds.has(e.id)
      );

      if (filteredNewEnrollments.length === 0) return;

      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          educationEnrollments: [
            ...existingEnrollments,
            ...filteredNewEnrollments,
          ],
        })
      );
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // useEffect(() => {
  //   if (scrollRef.current) {
  //     const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
  //
  //     // 스크롤이 최하단에 도달했는지 확인
  //     if (scrollTop + clientHeight >= scrollHeight) {
  //       console.log('!');
  //       // setPage(page + 1);
  //     }
  //   }
  // }, [scrollRef.current]);

  useEffect(() => {
    fetchEnrollments();
  }, [page]);
  // -------- enrollment ---------

  // ===== status =====

  const onChangeStatus = (status: TASK_STATUS) => {
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

  // 수강 교인 상태 변경
  const onChangeEnrollmentStatus = (
    value: EDUCATION_ENROLLMENT_STATUS,
    enrollment: EducationEnrollment
  ) => {
    try {
      educationEnrollmentsApi
        .editEducationEnrollment(
          {
            churchId,
            educationId: targetEducation.id,
            educationTermId: targetEducationTerm.id,
            educationEnrollmentId: enrollment.id,
          },
          { status: value }
        )
        .then((response) => {
          const newEducationEnrollment = response.data.data;

          const newEducationEnrollments =
            targetEducationTerm.educationEnrollments.map((enrollment) => {
              if (enrollment.id === newEducationEnrollment.id) {
                return newEducationEnrollment;
              } else {
                return enrollment;
              }
            });

          const newEducationTerm = {
            ...targetEducationTerm,
            educationEnrollments: newEducationEnrollments,
          };

          dispatch(setTargetEducationTerm(newEducationTerm));

          const newEducationTerms = targetEducation.educationTerms.map((v) => {
            return v.id !== targetEducationTerm.id ? v : newEducationTerm;
          });

          dispatch(setEducationTerms(newEducationTerms));
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onChangeHeaderBar = (headerBar: EDUCATION_TERM_CONTENT_ID) => {
    setHeaderBar(headerBar);
  };

  const onClickAddEnrollmentsOpen = () => setIsAddModalShown(true);

  const onClickAddEnrollmentsClose = () => {
    setIsAddModalShown(false);
    setSelectedMembers([]);
  };

  // 새로운 그룹원들 추가
  const onClickSaveNewEnrollments = async () => {
    try {
      if (selectedMembers.length === 0) return;

      await educationEnrollmentsApi.createEducationEnrollments(
        {
          churchId,
          educationId: targetEducationTerm.educationId,
          educationTermId: targetEducationTerm.id,
        },
        {
          memberIds: selectedMembers.map((member) => member.id),
        }
      );

      const response = await educationEnrollmentsApi.getEducationEnrollments({
        churchId,
        educationId: targetEducationTerm.educationId,
        educationTermId: targetEducationTerm.id,
      });

      const newEducationEnrollments = response.data.data;

      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          educationEnrollments: newEducationEnrollments,
        })
      );

      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setToastBackgroundColor(BLACK));
      dispatch(setIsToastShown(true));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.LIGHT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      setTimeout(() => {
        setSelectedMembers([]);
        setIsAddModalShown(false);
      });
    }
  };

  const onClickAddEducationSessionDone = async () => {
    try {
      const sessionResponse = await educationSessionsApi.createEducationSession(
        {
          churchId,
          educationId: targetEducationTerm.educationId,
          educationTermId: targetEducationTerm.id,
        },
        {
          title: targetEducationSession.title,
          startDate: getFullStringFromDate(
            getDateFromDateString(targetEducationSession.startDate)
          ),
          endDate: getFullStringFromDate(
            getDateFromDateString(targetEducationSession.endDate)
          ),
          inChargeId: targetEducationSession.inChargeId,
          content: targetEducationSession.content,
          receiverIds: targetEducationSession.receiverIds,
        }
      );

      const newEducationSession = sessionResponse.data.data;

      const newEducationTerm = {
        ...targetEducationTerm,
        educationSessions: [
          ...targetEducationTerm.educationSessions,
          newEducationSession,
        ],
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

      dispatch(setTargetEducationSession(DEFAULT_EDUCATION_SESSION));
      dispatch(setTargetEducationTerm(newEducationTerm));
      dispatch(setEducations(newEducations));

      setIsEducationSessionAddShown(false);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setIsToastShown(true));
      dispatch(setToastText(t_popup('saveComplete')));
    }
  };

  const onClickAddEducationSessionOpen = () => {
    dispatch(setTargetEducationSession(targetEducationSession));
    setIsEducationSessionAddShown(true);
  };

  const onClickAddEducationSessionClose = async () => {
    setIsEducationSessionAddShown(false);
    dispatch(setTargetEducationSession(DEFAULT_EDUCATION_SESSION));
  };

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

  const props = {
    isAddModalShown,
    headerBar,
    onChangeStatus,
    onChangeEnrollmentStatus,
    onChangeHeaderBar,
    onClickAddEnrollmentsOpen,
    onClickAddEnrollmentsClose,
    onClickSaveNewEnrollments,
    onClickAddEducationSessionOpen,
    selectedMembers,
    setSelectedMembers,
  };
  return (
    <>
      <EducationTermInformationView {...props} />

      {/* 교육회차 추가 팝업*/}
      <WrappedPagePopup
        keyboardDisabled={true}
        isShow={isEducationSessionAddShown}
        onClickClose={onClickAddEducationSessionClose}
        onClickCancel={onClickAddEducationSessionClose}
        onClickDone={onClickAddEducationSessionDone}
        headerTitle={t_title('addEducationSession')}
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

export default EducationTermInformation;
