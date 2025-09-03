import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { ALL, BLANK, ORDER_DIRECTION } from '../../../../constants/constant';
import { WORSHIP_ENROLLMENT } from '../../../../constants/column/worship-column';
import {
  setWorshipEnrollmentOrderBy,
  setWorshipEnrollmentOrderDirection,
} from '../../../../redux/reducers/filter/worship-enrollment-filter-reducer';
import AttendanceTableView from './attendance-table.view';
import {
  setTargetWorshipSession,
  setTargetWorshipSessionGroup,
  setTargetWorshipSessionWorship,
} from '../../../../redux/reducers/target/target-worship-session-reducer';
import {
  DEFAULT_WORSHIP_SESSION,
  WorshipSessionCheckStatus,
} from '../../../../models/worship/worship';
import { WorshipSessionsApi } from '../../../../api/worship/worship-sessions.api';
import { getDateStringFromDate } from '../../../../utils/date';

export type AttendanceTableProps = {
  loadWorshipEnrollments: () => Promise<void>;
  isStatisticOpened: boolean;
  onClickStatisticChevron: () => void;
};

const AttendanceTable = ({
  loadWorshipEnrollments,
  isStatisticOpened,
}: AttendanceTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const worshipSessionsApi = new WorshipSessionsApi(false);

  const { churchId } = useSelector((state: RootState) => state.church);

  const { targetWorship, targetWorshipGroup } = useSelector(
    (state: RootState) => state.targetWorship
  );

  const {
    worshipEnrollments,
    worshipEnrollmentFilter,
    worshipEnrollmentOrderBy,
    worshipEnrollmentOrderDirection,
  } = useSelector((state: RootState) => state.worshipEnrollmentFilter);

  // 상세정보 팝업 On/Off
  const [isSessionShown, setIsSessionShown] = useState<boolean>(false);

  const [checkStatuses, setCheckStatuses] = useState<
    WorshipSessionCheckStatus[]
  >([]);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      // 스크롤이 최하단에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight) {
        loadWorshipEnrollments(); // 데이터를 추가로 로드
      }
    }
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [
    worshipEnrollmentFilter,
    worshipEnrollmentOrderBy,
    worshipEnrollmentOrderDirection,
  ]);

  // 테이블 헤더 클릭 이벤트
  const onClickHeader = async (
    id: WORSHIP_ENROLLMENT | string,
    isSession: boolean,
    sessionDate?: Date
  ) => {
    // 세션 열인 경우 세션 상세로
    if (isSession && sessionDate) {
      try {
        const response = await worshipSessionsApi.getWorshipSessionByDate({
          churchId,
          worshipId: targetWorship.id,
          sessionDate: getDateStringFromDate(sessionDate),
        });

        const newWorshipSession = response.data.data;
        dispatch(setTargetWorshipSession(newWorshipSession));
        dispatch(setTargetWorshipSessionGroup(targetWorshipGroup));
        dispatch(setTargetWorshipSessionWorship(targetWorship));

        setIsSessionShown(true);
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }
    // 그 외는 정렬
    else {
      let newOrderBy = id as WORSHIP_ENROLLMENT;

      if (newOrderBy !== worshipEnrollmentOrderBy) {
        dispatch(setWorshipEnrollmentOrderBy(newOrderBy));
        dispatch(setWorshipEnrollmentOrderDirection(ORDER_DIRECTION.ASC));
      } else {
        dispatch(
          setWorshipEnrollmentOrderDirection(
            worshipEnrollmentOrderDirection === ORDER_DIRECTION.ASC
              ? ORDER_DIRECTION.DESC
              : ORDER_DIRECTION.ASC
          )
        );
      }
    }
  };

  // 상세 페이지 종료
  const onClickSessionClose = () => {
    setIsSessionShown(false);
    dispatch(setTargetWorshipSession(DEFAULT_WORSHIP_SESSION));
  };

  const fetchWorshipSessionCheckStatus = async () => {
    if (!targetWorship.id) return;
    if (
      worshipEnrollmentFilter.fromSessionDate === BLANK ||
      worshipEnrollmentFilter.toSessionDate === BLANK
    )
      return;

    try {
      const response = await worshipSessionsApi.getWorshipSessionCheckStatus({
        churchId,
        worshipId: targetWorship.id,
        groupId:
          targetWorshipGroup.id === ALL
            ? undefined
            : (targetWorshipGroup.id as string),
        from: worshipEnrollmentFilter.fromSessionDate,
        to: worshipEnrollmentFilter.toSessionDate,
      });

      const newCheckStatuses = response.data.data;
      setCheckStatuses(newCheckStatuses);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    fetchWorshipSessionCheckStatus();
  }, [
    targetWorship.id,
    worshipEnrollmentFilter.fromSessionDate,
    worshipEnrollmentFilter.toSessionDate,
    targetWorshipGroup.id,
  ]);

  const props = {
    isSessionShown,
    isStatisticOpened,
    onClickSessionClose,
    worshipEnrollments,
    scrollRef,
    onScroll,
    onClickHeader,
    checkStatuses,
  };

  return (
    <>
      <AttendanceTableView {...props} />
    </>
  );
};

export default AttendanceTable;
