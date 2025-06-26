import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { WorshipsApi } from '@/api/worship/worships.api';
import { DEFAULT_GROUP, Group } from '@/models/management/management';
import { getGroup } from '@/utils/group';
import { Worship, WorshipAttendance } from '@/models/worship/worship';
import {
  setTargetWorshipSession,
  setTargetWorshipSessionGroup,
  setTargetWorshipSessionWorship,
} from '@/redux/reducers/target/target-worship-session-reducer';
import AttendanceInformationView from '@/components/organisms/attendance/information/attendance-information.view';
import {
  fetchWorshipAttendances,
  setWorshipAttendances,
} from '@/redux/reducers/filter/worship-attendance-filter-reducer';
import Loading from '@/components/atoms/common/etc/loading';
import { WorshipSessionsApi } from '@/api/worship/worship-sessions.api';
import { getDateFromDateString, getDateInWeekByDayOfWeek } from '@/utils/date';
import { ATTENDANCE_CONTENT_ID } from '@/constants/layout/content';

type AttendanceInformationProps = {};

const AttendanceInformation = ({}: AttendanceInformationProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const worshipsApi = new WorshipsApi(false);
  const worshipSessionsApi = new WorshipSessionsApi(false);

  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const { groups } = useSelector((state: RootState) => state.church);
  const {
    targetWorshipSession,
    targetWorshipSessionWorship,
    targetWorshipSessionGroup,
  } = useSelector((state: RootState) => state.targetWorshipSession);
  const {
    worshipAttendances,
    worshipAttendanceFilter,
    worshipAttendanceOrderBy,
    worshipAttendanceOrderDirection,
  } = useSelector((state: RootState) => state.worshipAttendanceFilter);

  const [contentId, setContentId] = useState<ATTENDANCE_CONTENT_ID>(
    ATTENDANCE_CONTENT_ID.ATTENDANCE
  );
  // 그룹 모달 on off
  const [isGroupModalShown, setIsGroupModalShown] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickHeaderBar = (id: ATTENDANCE_CONTENT_ID) => {
    setContentId(id);
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
    const newGroup = getGroup(id, groups);
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
        sessionDate: getDateInWeekByDayOfWeek(
          getDateFromDateString(targetWorshipSession.sessionDate),
          newWorship.worshipDay
        ),
      });

      const newWorshipSession = sessionResponse.data.data;
      dispatch(setTargetWorshipSession(newWorshipSession));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onChangeWorship = (newWorship: Worship) => {
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
  };

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 무한 스크롤로 데이터 추가 로드
  const loadWorshipAttendances = async () => {
    if (!targetWorshipSessionWorship.id || !targetWorshipSession.id) return;
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchWorshipAttendances({
          churchId,
          currentPage: page + 1,
          worshipId: targetWorshipSessionWorship.id,
          sessionId: targetWorshipSession.id,
          groupId: targetWorshipSessionGroup.id || undefined,
        })
      );
      if (fetchWorshipAttendances.fulfilled.match(result)) {
        const newWorshipAttendances: WorshipAttendance[] = result.payload;
        if (newWorshipAttendances.length > 0) {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(
            worshipAttendances.map((worshipAttendance) => worshipAttendance.id)
          );
          const filteredNewAttendances = newWorshipAttendances.filter(
            (enrollment) => !existingIds.has(enrollment.id)
          );
          dispatch(
            setWorshipAttendances([
              ...worshipAttendances,
              ...filteredNewAttendances,
            ])
          );
          setPage((prev) => prev + 1); // 다음 페이지로 이동
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeDate = async (date: Date) => {
    if (!targetWorshipSessionWorship.id) return;

    try {
      const response = await worshipSessionsApi.getWorshipSessionByDate({
        churchId,
        worshipId: targetWorshipSessionWorship.id,
        sessionDate: date,
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
      const fetchInitialAttendances = async () => {
        try {
          const result = await dispatch(
            fetchWorshipAttendances({
              churchId,
              currentPage: 1,
              worshipId: targetWorshipSessionWorship.id,
              sessionId: targetWorshipSession.id,
              groupId: targetWorshipSessionGroup.id || undefined,
            })
          );
          if (fetchWorshipAttendances.fulfilled.match(result)) {
            dispatch(setWorshipAttendances(result.payload));
            setPage(1);
          }
        } catch (error) {
          setThrownError(
            error instanceof Error ? error : new Error(String(error))
          );
        }
      };

      fetchInitialAttendances();
    } else {
      dispatch(setWorshipAttendances([]));
    }
  }, [
    churchId,
    targetWorshipSessionWorship.id,
    targetWorshipSessionGroup.id,
    targetWorshipSession.id,
    worshipAttendanceFilter,
    worshipAttendanceOrderBy,
    worshipAttendanceOrderDirection,
  ]);

  useEffect(() => {
    onChangeWorship(targetWorshipSessionWorship);
  }, [targetWorshipSessionWorship]);

  const props = {
    contentId,
    isGroupModalShown,
    topLevelGroup,
    onClickGroupItem,
    onClickWorshipItem,
    onClickOpenGroupModal,
    onClickCloseGroupModal,
    onChangeDate,
    loadWorshipAttendances,
    onClickHeaderBar,
  };

  return (
    <>
      <AttendanceInformationView {...props} />
      <Loading isShow={isLoading} />
    </>
  );
};

export default AttendanceInformation;
