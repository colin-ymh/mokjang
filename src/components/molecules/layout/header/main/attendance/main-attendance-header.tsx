import { usePageRouter } from '@/utils/router';
import MainAttendanceHeaderView from '@/components/molecules/layout/header/main/attendance/main-attendance-header.view';
import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import AttendanceInformation from '@/components/organisms/attendance/information/attendance-information';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  setTargetWorshipSession,
  setTargetWorshipSessionGroup,
  setTargetWorshipSessionWorship,
} from '@/redux/reducers/target/target-worship-session-reducer';
import { DEFAULT_WORSHIP_SESSION } from '@/models/worship/worship';
import { WorshipSessionsApi } from '@/api/worship/worship-sessions.api';
import { useScopedI18n } from '../../../../../../../locales/client';
import { WorshipAttendancesApi } from '@/api/worship/worship-attendances.api';
import { BLANK } from '@/constants/constant';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import { DESTRUCTIVE } from '@/constants/styles/color';
import {
  fetchWorshipEnrollments,
  setWorshipEnrollments,
} from '@/redux/reducers/filter/worship-enrollment-filter-reducer';
import { getDateFromDateString, getDateStringFromDate } from '@/utils/date';

type MainAttendanceHeaderProps = {};

const MainAttendanceHeader = ({}: MainAttendanceHeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = usePageRouter();
  const t_button = useScopedI18n('button');
  const t_title = useScopedI18n('title');

  const worshipSessionsApi = new WorshipSessionsApi(false);
  const worshipAttendancesApi = new WorshipAttendancesApi(false);
  const { churchId } = useSelector((state: RootState) => state.church);

  const { targetWorship, targetWorshipGroup } = useSelector(
    (state: RootState) => state.targetWorship
  );

  const { targetWorshipSession } = useSelector(
    (state: RootState) => state.targetWorshipSession
  );

  const { worshipAttendances } = useSelector(
    (state: RootState) => state.worshipAttendanceFilter
  );

  // 상세정보 팝업 On/Off
  const [isSessionShown, setIsSessionShown] = useState<boolean>(false);

  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>(BLANK);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`/main/attendance/${id}`);
  };

  const onClickSessionOpen = async () => {
    try {
      const response = await worshipSessionsApi.createRecentWorshipSession({
        churchId,
        worshipId: targetWorship.id,
      });

      const newSession = response.data.data;
      dispatch(setTargetWorshipSession(newSession));
      dispatch(setTargetWorshipSessionGroup(targetWorshipGroup));
      dispatch(setTargetWorshipSessionWorship(targetWorship));
      setIsSessionShown(true);
    } catch (error) {
      if (error instanceof Error) {
        setToastText(error.message);
      } else {
        setThrownError(new Error(String(error)));
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
      await Promise.all(
        worshipAttendances.map(async (attendance) => {
          await worshipAttendancesApi.editWorshipAttendance(
            {
              churchId,
              worshipId: targetWorship.id,
              sessionId: targetWorshipSession.id,
              attendanceId: attendance.id,
            },
            {
              attendanceStatus: attendance.attendanceStatus,
              note: attendance.note,
            }
          );
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        setToastText(error.message);
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      const result = await dispatch(
        fetchWorshipEnrollments({
          churchId,
          currentPage: 1,
          worshipId: targetWorship.id,
        })
      );

      if (fetchWorshipEnrollments.fulfilled.match(result)) {
        dispatch(setWorshipEnrollments(result.payload));
      }

      setIsSessionShown(false);
    }
  };

  const props = {
    onClickHeaderBar,
    onClickSessionOpen,
  };

  return (
    <>
      <MainAttendanceHeaderView {...props} />

      {/* 회차 상세정보 팝업*/}
      <SlidePopup
        isShow={isSessionShown}
        onClickClose={onClickSessionClose}
        headerTitle={`${targetWorship.title} ${t_title('attendanceInformation')} (${getDateStringFromDate(getDateFromDateString(targetWorshipSession.sessionDate))})`}
        doneText={t_button('save')}
        onClickDone={onClickSessionSave}
      >
        <AttendanceInformation />
      </SlidePopup>

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

export default MainAttendanceHeader;
