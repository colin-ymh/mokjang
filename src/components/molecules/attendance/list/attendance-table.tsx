import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ORDER_DIRECTION } from '@/constants/constant';
import { WORSHIP_ENROLLMENT } from '@/constants/column/worship-column';
import {
  setWorshipEnrollmentOrderBy,
  setWorshipEnrollmentOrderDirection,
} from '@/redux/reducers/filter/worship-enrollment-filter-reducer';
import AttendanceTableView from '@/components/molecules/attendance/list/attendance-table.view';
import {
  setTargetWorshipSession,
  setTargetWorshipSessionGroup,
  setTargetWorshipSessionWorship,
} from '@/redux/reducers/target/target-worship-session-reducer';
import { DEFAULT_WORSHIP_SESSION } from '@/models/worship/worship';
import { WorshipSessionsApi } from '@/api/worship/worship-sessions.api';
import { getIsWellFormedTitle } from '@/utils/check';
import { getDateStringFromDate } from '@/utils/date';
import { setToastText } from '@/redux/reducers/toast-popup-reducer';

export type AttendanceTableProps = {
  loadWorshipEnrollments: () => Promise<void>;
};

const AttendanceTable = ({ loadWorshipEnrollments }: AttendanceTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const worshipSessionsApi = new WorshipSessionsApi(false);

  const { churchId } = useSelector((state: RootState) => state.church);

  const { targetWorship, targetWorshipGroup } = useSelector(
    (state: RootState) => state.targetWorship
  );
  const { targetWorshipSession, targetWorshipSessionWorship } = useSelector(
    (state: RootState) => state.targetWorshipSession
  );

  const {
    worshipEnrollments,
    worshipEnrollmentFilter,
    worshipEnrollmentOrderBy,
    worshipEnrollmentOrderDirection,
  } = useSelector((state: RootState) => state.worshipEnrollmentFilter);

  // 상세정보 팝업 On/Off
  const [isSessionShown, setIsSessionShown] = useState<boolean>(false);

  const [isEditOpened, setIsEditOpened] = useState<boolean>(false);
  const [isEditEnabled, setIsEditEnabled] = useState<boolean>(false);

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

  const onClickSessionSave = async () => {
    try {
      // 회차 정보 수정
      const response = await worshipSessionsApi.editWorshipSession(
        {
          churchId,
          worshipId: targetWorshipSessionWorship.id,
          sessionId: targetWorshipSession.id,
        },
        {
          title: targetWorshipSession.title || undefined,
          bibleTitle: targetWorshipSession.bibleTitle || undefined,
          videoUrl: targetWorshipSession.videoUrl || undefined,
          inChargeId: targetWorshipSession.inChargeId || undefined,
          description: targetWorshipSession.description || undefined,
        }
      );

      const newSession = response.data.data;

      dispatch(setTargetWorshipSession(newSession));
      setIsEditOpened(false);
      setTimeout(() => {
        setIsSessionShown(true);
      }, 500);
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  const onClickEditOpen = () => {
    setIsSessionShown(false);
    setTimeout(() => {
      setIsEditOpened(true);
    }, 500);
  };

  const onClickCloseEditModal = async () => {
    try {
      const response = await worshipSessionsApi.getWorshipSessionByDate({
        churchId,
        worshipId: targetWorshipSessionWorship.id,
        sessionDate: targetWorshipSession.sessionDate,
      });

      const prevSession = response.data.data;

      dispatch(setTargetWorshipSession(prevSession));
      setIsEditOpened(false);
      setTimeout(() => {
        setIsSessionShown(true);
      }, 500);
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  useEffect(() => {
    if (
      targetWorshipSession.title &&
      !getIsWellFormedTitle(targetWorshipSession.title)
    ) {
      setIsEditEnabled(false);
      return;
    }

    setIsEditEnabled(true);
  }, [targetWorshipSession]);

  const props = {
    isSessionShown,
    isEditOpened,
    isEditEnabled,
    onClickCloseEditModal,
    onClickSessionClose,
    onClickEditOpen,
    onClickSessionSave,
    worshipEnrollments,
    scrollRef,
    onScroll,
    onClickHeader,
  };

  return (
    <>
      <AttendanceTableView {...props} />
    </>
  );
};

export default AttendanceTable;
