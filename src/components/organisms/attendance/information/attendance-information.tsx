import React, { RefObject, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { WorshipsApi } from '@/api/worship/worships.api';
import { DEFAULT_GROUP, Group } from '@/models/management/management';
import { getGroup } from '@/utils/group';
import { Worship, WORSHIP_ATTENDANCE_STATUS, WorshipAttendance, } from '@/models/worship/worship';
import {
  setTargetWorshipSession,
  setTargetWorshipSessionGroup,
  setTargetWorshipSessionStatistic,
  setTargetWorshipSessionWorship,
} from '@/redux/reducers/target/target-worship-session-reducer';
import AttendanceInformationView from '@/components/organisms/attendance/information/attendance-information.view';
import {
  fetchWorshipAttendances,
  setWorshipAttendanceCursor,
  setWorshipAttendances,
} from '@/redux/reducers/filter/worship-attendance-filter-reducer';
import { WorshipSessionsApi } from '@/api/worship/worship-sessions.api';
import { getDateFromDateString, getDateInWeekByDayOfWeek, getDateStringFromDate, } from '@/utils/date';
import { ALL, BLANK } from '@/constants/constant';
import { CustomError } from '@/api/error/error';
import { WorshipAttendancesApi } from '@/api/worship/worship-attendances.api';
import { setWorshipEnrollments } from '@/redux/reducers/filter/worship-enrollment-filter-reducer';

type AttendanceInformationProps = { scrollRef: RefObject<HTMLDivElement> };

const AttendanceInformation = ({ scrollRef }: AttendanceInformationProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const worshipsApi = new WorshipsApi(false);
  const worshipSessionsApi = new WorshipSessionsApi(false);
  const worshipAttendancesApi = new WorshipAttendancesApi(false);

  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const { groups } = useSelector((state: RootState) => state.church);
  const { targetWorship } = useSelector(
    (state: RootState) => state.targetWorship
  );
  const {
    targetWorshipSession,
    targetWorshipSessionWorship,
    targetWorshipSessionGroup,
  } = useSelector((state: RootState) => state.targetWorshipSession);
  const {
    worshipAttendances,
    worshipAttendanceFilter,
    worshipAttendanceSortBy,
    worshipAttendanceSortDirection,
    loading,
    hasMore,
  } = useSelector((state: RootState) => state.worshipAttendanceFilter);
  const { worshipEnrollments } = useSelector(
    (state: RootState) => state.worshipEnrollmentFilter
  );

  useEffect(() => {
    const ref = scrollRef?.current;
    if (!ref) return;
    const handleScroll = () => {
      if (
        ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 10 &&
        !loading &&
        hasMore
      ) {
        dispatch(fetchWorshipAttendances());
      }
    };
    ref.addEventListener('scroll', handleScroll);
    return () => {
      ref.removeEventListener('scroll', handleScroll);
    };
  }, [scrollRef, loading, hasMore, dispatch]);

  // 그룹 모달 on off
  const [isGroupModalShown, setIsGroupModalShown] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickAllAttended = () => {
    try {
      const newWorshipAttendances = worshipAttendances.map((attendance) => {
        return {
          ...attendance,
          attendanceStatus: WORSHIP_ATTENDANCE_STATUS.PRESENT,
        } as WorshipAttendance;
      });

      dispatch(setWorshipAttendances(newWorshipAttendances));

      const newWorshipEnrollments = worshipEnrollments.map((enrollment) => {
        return {
          ...enrollment,
          worshipAttendances: enrollment.worshipAttendances.map(
            (worshipAttendance) => {
              if (
                worshipAttendance.sessionDate ===
                targetWorshipSession.sessionDate
              ) {
                return {
                  ...worshipAttendance,
                  attendanceStatus: WORSHIP_ATTENDANCE_STATUS.PRESENT,
                };
              } else {
                return worshipAttendance;
              }
            }
          ),
        };
      });

      dispatch(setWorshipEnrollments(newWorshipEnrollments));

      worshipAttendancesApi.patchAllAttended(
        {
          churchId,
          worshipId: targetWorshipSessionWorship.id,
          sessionId: targetWorshipSession.id,
        },
        {
          groupId: targetWorshipSessionGroup.id || undefined,
        }
      );
    } catch (error) {
      setThrownError(error as CustomError);
    }
  };

  // 목록 설정 모달 열기
  const onClickOpenGroupModal = () => {
    setIsGroupModalShown(true);
  };

  // 목록 설정 닫기
  const onClickCloseGroupModal = () => {
    setIsGroupModalShown(false);
  };

  // 최상위 그룹
  const [topLevelGroup, setTopLevelGroup] = useState<Group>(DEFAULT_GROUP);

  // 그룹 선택
  const onClickGroupItem = (id: string | null) => {
    const newGroup = id === ALL ? DEFAULT_GROUP : getGroup(id, groups);
    dispatch(setTargetWorshipSessionGroup(newGroup));
    setIsGroupModalShown(false);
  };

  // 예배 변경 이벤트
  const onClickWorshipItem = async (id: string) => {
    try {
      // 해당 예배의 그룹 범위에 따라 그룹 선택 초기화
      const response = await worshipsApi.getWorship({
        churchId,
        worshipId: id,
      });

      const newWorship: Worship = response.data.data;
      dispatch(setTargetWorshipSessionWorship(newWorship));

      const sessionResponse = await worshipSessionsApi.getWorshipSessionByDate({
        churchId,
        worshipId: newWorship.id,
        // 이전에 확인 중이던 세션의 날짜와 새로운 예배의 day index 를 활용해, 새로운 sessionDate 생성
        sessionDate: getDateStringFromDate(
          getDateInWeekByDayOfWeek(
            getDateFromDateString(targetWorshipSession.sessionDate),
            newWorship.worshipDay
          )
        ),
      });

      const newWorshipSession = sessionResponse.data.data;
      dispatch(setTargetWorshipSession(newWorshipSession));

      // 그룹 선택 초기화
      if (newWorship.worshipTargetGroups.length > 0) {
        const newGroup = getGroup(
          newWorship.worshipTargetGroups[0].group.id,
          groups
        );
        dispatch(setTargetWorshipSessionGroup(newGroup));
        setTopLevelGroup(newGroup);
      } else {
        dispatch(setTargetWorshipSessionGroup(DEFAULT_GROUP));
        setTopLevelGroup(DEFAULT_GROUP);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onChangeDate = async (date: Date) => {
    if (!targetWorshipSessionWorship.id) return;

    try {
      const response = await worshipSessionsApi.getWorshipSessionByDate({
        churchId,
        worshipId: targetWorshipSessionWorship.id,
        sessionDate: getDateStringFromDate(date),
      });

      const newWorshipSession = response.data.data;
      dispatch(setTargetWorshipSession(newWorshipSession));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 필터 정보가 변경될 때, 출석부를 다시 불러오는 부분
  useEffect(() => {
    if (targetWorshipSessionWorship.id && targetWorshipSession.id) {
      dispatch(setWorshipAttendanceCursor(BLANK));
      dispatch(setWorshipAttendances([])); // 초기화 필요시 유지
      dispatch(fetchWorshipAttendances());
    } else {
      dispatch(setWorshipAttendances([]));
    }
  }, [
    churchId,
    targetWorshipSessionWorship.id,
    targetWorshipSessionGroup.id,
    targetWorshipSession.id,
    worshipAttendanceFilter,
    worshipAttendanceSortBy,
    worshipAttendanceSortDirection,
  ]);

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [
    worshipAttendanceFilter,
    worshipAttendanceSortBy,
    worshipAttendanceSortDirection,
  ]);

  const fetchSessionStatistic = async () => {
    if (targetWorshipSession.id) {
      try {
        const statisticResponse =
          await worshipSessionsApi.getWorshipSessionStatistics({
            churchId,
            worshipId: targetWorshipSession.worshipId,
            sessionId: targetWorshipSession.id,
            groupId:
              targetWorshipSessionGroup.id === ALL
                ? undefined
                : (targetWorshipSessionGroup.id as string),
          });
        const newStatistic = statisticResponse.data;
        dispatch(setTargetWorshipSessionStatistic(newStatistic));
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }
  };

  useEffect(() => {
    fetchSessionStatistic();
  }, [targetWorshipSession.id, targetWorshipSessionGroup.id]);

  const props = {
    isGroupModalShown,
    topLevelGroup,
    onClickGroupItem,
    onClickWorshipItem,
    onClickOpenGroupModal,
    onClickCloseGroupModal,
    onChangeDate,
    onClickAllAttended,
  };

  return (
    <>
      <AttendanceInformationView {...props} />
    </>
  );
};

export default AttendanceInformation;
