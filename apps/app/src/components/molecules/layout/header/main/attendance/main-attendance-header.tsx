import MainAttendanceHeaderView from './main-attendance-header.view';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../../redux/store';
import {
  setTargetWorshipSession,
  setTargetWorshipSessionGroup,
  setTargetWorshipSessionWorship,
} from '../../../../../../redux/reducers/target/target-worship-session-reducer';
import { DEFAULT_WORSHIP_SESSION } from '@mokjang/models';
import { WorshipSessionsApi } from '../../../../../../api/worship/worship-sessions.api';
import {
  setIsToastShown,
  setToastText,
} from '../../../../../../redux/reducers/toast-popup-reducer';
import { usePageRouter } from '@mokjang/utils';

type MainAttendanceHeaderProps = {};

const MainAttendanceHeader = ({}: MainAttendanceHeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const worshipSessionsApi = new WorshipSessionsApi(false);

  const router = usePageRouter();

  const { churchId } = useSelector((state: RootState) => state.church);

  const { targetWorship, targetWorshipGroup } = useSelector(
    (state: RootState) => state.targetWorship
  );
  // 상세정보 팝업 On/Off
  const [isSessionShown, setIsSessionShown] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickSessionOpen = async () => {
    try {
      const response = await worshipSessionsApi.getWorshipSession({
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
        dispatch(setToastText(error.message));
        dispatch(setIsToastShown(true));
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

  const onClickGoBack = () => {
    router.push('/main/worship');
  };

  const props = {
    isSessionShown,
    onClickSessionClose,
    onClickSessionOpen,
    onClickGoBack,
  };

  return (
    <>
      <MainAttendanceHeaderView {...props} />
    </>
  );
};

export default MainAttendanceHeader;
