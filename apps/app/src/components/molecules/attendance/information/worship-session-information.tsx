import WorshipSessionInformationView from './worship-session-information.view';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { WorshipSessionsApi } from '../../../../api/worship/worship-sessions.api';
import React, { useEffect, useState } from 'react';
import { setTargetWorshipSession } from '../../../../redux/reducers/target/target-worship-session-reducer';
import { setToastText } from '../../../../redux/reducers/toast-popup-reducer';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getIsWellFormedTitle,
} from '@mokjang/utils';
import { MAIN } from '@mokjang/constants';
import EditWorshipSession from '../../../organisms/attendance/edit/edit-worship-session';
import { useScopedI18n } from '../../../../../locales/client';
import { CustomPopup } from '@mokjang/components';

const WorshipSessionInformation = () => {
  const t_title = useScopedI18n('title');
  const t_button = useScopedI18n('button');

  const dispatch = useDispatch<AppDispatch>();
  const worshipSessionsApi = new WorshipSessionsApi(false);

  const { churchId } = useSelector((state: RootState) => state.church);

  const { targetWorshipSession, targetWorshipSessionWorship } = useSelector(
    (state: RootState) => state.targetWorshipSession
  );

  // 예배 상세정보 수정
  const [isEditOpened, setIsEditOpened] = useState<boolean>(false);
  const [isEditEnabled, setIsEditEnabled] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickEditOpen = () => {
    setIsEditOpened(true);
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
        sessionDate: getDateStringFromDate(
          getDateFromDateString(targetWorshipSession.sessionDate)
        ),
      });

      const prevSession = response.data.data;

      dispatch(setTargetWorshipSession(prevSession));
      setIsEditOpened(false);
    } catch (error) {
      if (error instanceof Error) {
        setToastText(error.message);
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
    onClickEditOpen,
  };

  return (
    <>
      <WorshipSessionInformationView {...props} />

      {/* 회차 상세 수정 팝업 */}
      <CustomPopup
        isShow={isEditOpened}
        headerTitle={t_title('editWorshipInformation')}
        onClickClose={onClickCloseEditModal}
        onClickDone={onClickSessionSave}
        onClickCancel={onClickCloseEditModal}
        doneBackgroundColor={isEditEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isEditEnabled}
        width={600}
        height={600}
        cancelText={t_button('cancel')}
        doneText={t_button('confirm')}
      >
        <EditWorshipSession />
      </CustomPopup>
    </>
  );
};

export default WorshipSessionInformation;
