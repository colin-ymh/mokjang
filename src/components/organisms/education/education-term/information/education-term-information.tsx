import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { EducationTermsApi } from '@/api/education/education-terms.api';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_EDUCATION_SESSION,
  EducationEnrollment,
  EducationSession,
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

type EducationTermInformationProps = {
  scrollRef: RefObject<HTMLDivElement>;
};

const EducationTermInformation = ({
  scrollRef,
}: EducationTermInformationProps) => {
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

  // 최신 targetEducationTerm을 보관해 비동기 클로저에서의 상태 유실 방지
  const termRef = useRef(targetEducationTerm);
  useEffect(() => {
    termRef.current = targetEducationTerm;
  }, [targetEducationTerm]);

  const dispatch = useDispatch<AppDispatch>();
  const educationTermsApi = new EducationTermsApi(false);
  const educationEnrollmentsApi = new EducationEnrollmentsApi(false);
  const educationSessionsApi = new EducationSessionsApi(false);

  const [headerBar, setHeaderBar] = useState<EDUCATION_TERM_CONTENT_ID>(
    EDUCATION_TERM_CONTENT_ID.SESSIONS
  );

  const [sessionPage, setSessionPage] = useState<number>(1);
  const [enrollmentPage, setEnrollmentPage] = useState<number>(1);

  const TAKE = 10; // 한번에 가져올 개수(무한스크롤 페이지 사이즈)

  // 무한스크롤 제어용 상태
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(false);
  const [hasMoreSession, setHasMoreSession] = useState<boolean>(true);

  // 무한스크롤 제어용 상태
  const [isEnrollmentLoading, setIsEnrollmentLoading] =
    useState<boolean>(false);
  const [hasMoreEnrollment, setHasMoreEnrollment] = useState<boolean>(true);

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
    // 이미 로딩 중이거나 더 불러올 데이터가 없다면 중단
    if (isEnrollmentLoading || !hasMoreEnrollment) return;
    setIsEnrollmentLoading(true);
    try {
      const response = await educationEnrollmentsApi.getEducationEnrollments({
        churchId,
        educationId: targetEducationTerm.educationId,
        educationTermId: targetEducationTerm.id,
        page: enrollmentPage,
        take: TAKE,
      });

      const newEnrollments: EducationEnrollment[] = response.data.data;

      // 불러온 데이터가 없으면 더 이상 페이지가 없다고 판단
      if (!newEnrollments || newEnrollments.length === 0) {
        setHasMoreEnrollment(false);
        return;
      }

      const existingEnrollments = termRef.current?.educationEnrollments || [];

      // 중복 ID 제거
      const existingIds = new Set(existingEnrollments.map((e) => e.id));
      const filteredNewEnrollments = newEnrollments.filter(
        (e) => !existingIds.has(e.id)
      );

      if (filteredNewEnrollments.length === 0) {
        // 가져온 데이터가 모두 중복이면, 더 이상 가져올 게 없다고 판단
        setHasMoreEnrollment(false);
        return;
      }

      dispatch(
        setTargetEducationTerm({
          ...termRef.current,
          educationEnrollments: [
            ...existingEnrollments,
            ...filteredNewEnrollments,
          ],
        })
      );

      // 이번 페이지에서 TAKE보다 적게 가져왔으면 다음 페이지는 없음
      if (filteredNewEnrollments.length < TAKE) {
        setHasMoreEnrollment(false);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsEnrollmentLoading(false);
    }
  };

  // 공용 스크롤 이벤트: headerBar에 따라 enrollment/session 페이징을 분기
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const threshold = 16; // px

    const onScroll = () => {
      // 스크롤 가능한 상태(내용 높이가 컨테이너보다 큰가)
      const isScrollable = el.scrollHeight > el.clientHeight + 1;
      if (!isScrollable) return;

      // 최하단 근접 체크
      const isNearBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
      if (!isNearBottom) return;

      // headerBar 에 따라 어떤 리스트를 불러올지 결정
      if (headerBar === EDUCATION_TERM_CONTENT_ID.SESSIONS) {
        // 이미 로딩 중이거나 더 불러올 데이터가 없다면 중단
        if (!isSessionLoading && hasMoreSession) {
          setSessionPage((prev) => prev + 1);
        }
      } else if (headerBar === EDUCATION_TERM_CONTENT_ID.ENROLLMENTS) {
        // 이미 로딩 중이거나 더 불러올 데이터가 없다면 중단
        if (!isEnrollmentLoading && hasMoreEnrollment) {
          setEnrollmentPage((prev) => prev + 1);
        }
      }
    };

    el.addEventListener('scroll', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
    };
  }, [
    scrollRef,
    headerBar,
    isSessionLoading,
    hasMoreSession,
    isEnrollmentLoading,
    hasMoreEnrollment,
  ]);

  useEffect(() => {
    fetchEnrollments();
  }, [enrollmentPage]);
  // -------- enrollment ---------

  // -------- session ---------
  const fetchSessions = async () => {
    // 이미 로딩 중이거나 더 불러올 데이터가 없다면 중단
    if (isSessionLoading || !hasMoreSession) return;
    setIsSessionLoading(true);
    try {
      const response = await educationSessionsApi.getEducationSessions({
        churchId,
        educationId: targetEducationTerm.educationId,
        educationTermId: targetEducationTerm.id,
        page: sessionPage,
        take: TAKE,
      });

      const newSessions: EducationSession[] = response.data.data;

      // 불러온 데이터가 없으면 더 이상 페이지가 없다고 판단
      if (!newSessions || newSessions.length === 0) {
        setHasMoreSession(false);
        return;
      }

      const existingSessions = termRef.current?.educationSessions || [];

      // 중복 ID 제거
      const existingIds = new Set(existingSessions.map((e) => e.id));
      const filteredNewSessions = newSessions.filter(
        (e) => !existingIds.has(e.id)
      );

      if (filteredNewSessions.length === 0) {
        // 가져온 데이터가 모두 중복이면, 더 이상 가져올 게 없다고 판단
        setHasMoreSession(false);
        return;
      }

      dispatch(
        setTargetEducationTerm({
          ...termRef.current,
          educationSessions: [...existingSessions, ...filteredNewSessions],
        })
      );

      // 이번 페이지에서 TAKE보다 적게 가져왔으면 다음 페이지는 없음
      if (filteredNewSessions.length < TAKE) {
        setHasMoreSession(false);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsSessionLoading(false);
    }
  };

  // (공용 스크롤 이벤트로 대체됨)

  useEffect(() => {
    fetchSessions();
  }, [sessionPage]);
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
