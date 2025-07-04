import { usePageRouter } from '@/utils/router';
import MainAttendanceHeaderView from '@/components/molecules/layout/header/main/attendance/main-attendance-header.view';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  setTargetWorshipSession,
  setTargetWorshipSessionGroup,
  setTargetWorshipSessionWorship,
} from '@/redux/reducers/target/target-worship-session-reducer';
import {
  DEFAULT_WORSHIP,
  DEFAULT_WORSHIP_SESSION,
} from '@/models/worship/worship';
import { WorshipSessionsApi } from '@/api/worship/worship-sessions.api';
import { BLANK } from '@/constants/constant';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import { DESTRUCTIVE } from '@/constants/styles/color';
import { setTargetWorship } from '@/redux/reducers/target/target-worship-reducer';
import { setWorships } from '@/redux/reducers/filter/worship-filter-reducer';
import { getIsWellFormedTitle } from '@/utils/check';
import { WorshipsApi } from '@/api/worship/worships.api';

type MainAttendanceHeaderProps = {};

const MainAttendanceHeader = ({}: MainAttendanceHeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = usePageRouter();
  const worshipsApi = new WorshipsApi(false);
  const worshipSessionsApi = new WorshipSessionsApi(false);
  const { worships } = useSelector((state: RootState) => state.worshipFilter);

  const { churchId } = useSelector((state: RootState) => state.church);

  const { targetWorship, targetWorshipGroup } = useSelector(
    (state: RootState) => state.targetWorship
  );

  const { targetWorshipSession, targetWorshipSessionWorship } = useSelector(
    (state: RootState) => state.targetWorshipSession
  );

  // 상세정보 팝업 On/Off
  const [isSessionShown, setIsSessionShown] = useState<boolean>(false);

  // 예배
  const [isAddWorshipOpened, setIsAddWorshipOpened] = useState<boolean>(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  // 예배 상세정보 수정
  const [isEditOpened, setIsEditOpened] = useState<boolean>(false);
  const [isEditEnabled, setIsEditEnabled] = useState<boolean>(false);

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

  const onClickEditOpen = () => {
    setIsSessionShown(false);
    setTimeout(() => {
      setIsEditOpened(true);
    }, 500);
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
        setToastText(error.message);
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  const onClickCloseEditModal = async () => {
    try {
      const response = await worshipSessionsApi.getWorshipSession({
        churchId,
        worshipId: targetWorshipSessionWorship.id,
        sessionId: targetWorshipSession.id,
      });

      const prevSession = response.data.data;

      dispatch(setTargetWorshipSession(prevSession));
      setIsEditOpened(false);
      setTimeout(() => {
        setIsSessionShown(true);
      }, 500);
    } catch (error) {
      if (error instanceof Error) {
        setToastText(error.message);
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  const onClickAddWorship = () => {
    setIsAddWorshipOpened(true);
    dispatch(setTargetWorship({ ...DEFAULT_WORSHIP, id: 'TEMP' }));
  };

  const onClickCloseModal = () => {
    setIsAddWorshipOpened(false);
    dispatch(setTargetWorship(DEFAULT_WORSHIP));
  };

  const onClickSaveWorship = async () => {
    try {
      await worshipsApi
        .createWorship(
          { churchId },
          {
            title: targetWorship.title,
            description: targetWorship.description,
            worshipDay: targetWorship.worshipDay,
            repeatPeriod: targetWorship.repeatPeriod,
            worshipTargetGroupIds: targetWorship.worshipTargetGroupIds,
          }
        )
        .then((response) => {
          const newWorship = response.data.data;

          dispatch(setWorships([...worships, newWorship]));
          dispatch(setTargetWorship(DEFAULT_WORSHIP));
          setIsAddWorshipOpened(false);
        });
    } catch (error) {
      if (error instanceof Error) {
        setToastText(error.message);
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  useEffect(() => {
    if (!getIsWellFormedTitle(targetWorship.title)) {
      setIsSaveEnabled(false);
      return;
    }

    setIsSaveEnabled(true);
  }, [targetWorship]);

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

  useEffect(() => {
    if (toastText) {
      setIsToastShown(true);
    }
  }, [toastText]);

  const props = {
    isSessionShown,
    isAddWorshipOpened,
    isSaveEnabled,
    isEditEnabled,
    isEditOpened,
    onClickCloseEditModal,
    onClickSessionSave,
    onClickEditOpen,
    onClickSessionClose,
    onClickCloseModal,
    onClickSaveWorship,
    onClickHeaderBar,
    onClickSessionOpen,
    onClickAddWorship,
  };

  return (
    <>
      <MainAttendanceHeaderView {...props} />

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
