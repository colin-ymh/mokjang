import {
  DEFAULT_MINISTRY_DETAIL_HISTORY,
  DEFAULT_MINISTRY_HISTORY,
  MinistryDetailHistory,
  MinistryHistory,
} from '@mokjang/models';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import MinistryHistoryItemView from './ministry-history-item.view';
import {
  setTargetMinistryDetailHistory,
  setTargetMinistryHistory,
} from '../../../../redux/reducers/target/target-history-reducer';
import { getDateFromDateString, getDateStringFromDate } from '@mokjang/utils';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '../../../../redux/reducers/toast-popup-reducer';
import { BLACK, DESTRUCTIVE } from '@mokjang/constants';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { CustomPopup } from '@mokjang/components';
import ConfirmPopup from '../../common/popup/error-popup';
import EditMinistryDetailHistory from '../../../molecules/member/information/history/ministry/edit-ministry-detail-history';
import { MinistryHistoryApi } from '../../../../api/history/ministry-history.api';

type MinistryHistoryItemProps = {
  history: MinistryHistory;
  onClickMinistryOpen: (history: MinistryHistory) => void;
};

const MinistryHistoryItem = ({
  history,
  onClickMinistryOpen,
}: MinistryHistoryItemProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');

  const dispatch = useDispatch<AppDispatch>();
  const ministryHistoryApi = new MinistryHistoryApi(false);

  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const { targetMinistryDetailHistory, targetMinistryHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  const [isDetailOpened, setIsDetailOpened] = useState<boolean>(false);

  const [isDetailSaveEnabled, setIsDetailSaveEnabled] =
    useState<boolean>(false);

  const [isDeleteOpened, setIsDeleteOpened] = useState<boolean>(false);

  const [details, setDetails] = useState<MinistryDetailHistory[] | undefined>(
    undefined
  );

  const [isOpened, setIsOpened] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickDetail = async () => {
    if (isOpened) {
      setIsOpened(false);
      return;
    }

    try {
      setIsOpened(true);

      if (!details) {
        const response = await ministryHistoryApi.getMinistryDetailHistory({
          churchId,
          memberId: targetMember.id,
          ministryGroupHistoryId: history.id,
        });

        const newDetails = response.data.data;

        setDetails(newDetails);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // ===================== 세부 ===================== //

  const onClickDetailOpen = (
    history: MinistryDetailHistory,
    group: MinistryHistory
  ) => {
    setIsDetailOpened(true);
    dispatch(
      setTargetMinistryDetailHistory({
        ...history,
        startDate: getDateStringFromDate(
          getDateFromDateString(history.startDate)
        ),
      })
    );
    dispatch(setTargetMinistryHistory(group));
  };
  const onClickDetailClose = () => {
    setIsDetailOpened(false);
    dispatch(setTargetMinistryDetailHistory(DEFAULT_MINISTRY_DETAIL_HISTORY));
    dispatch(setTargetMinistryHistory(DEFAULT_MINISTRY_HISTORY));
  };

  const onClickSaveDetail = async () => {
    try {
      const response = await ministryHistoryApi.editMinistryDetailHistory(
        {
          churchId,
          memberId: targetMember.id,
          ministryGroupHistoryId: targetMinistryHistory.id,
          detailHistoryId: targetMinistryDetailHistory.id,
        },
        {
          startDate: getDateStringFromDate(
            getDateFromDateString(targetMinistryDetailHistory.startDate)
          ),
          endDate: getDateStringFromDate(
            getDateFromDateString(targetMinistryDetailHistory.endDate)
          ),
        }
      );

      const newDetail = response.data.data;

      const newDetails = details?.map((d) => {
        if (d.id === newDetail.id) {
          return newDetail;
        } else {
          return d;
        }
      });

      setDetails(newDetails);

      dispatch(setTargetMinistryHistory(DEFAULT_MINISTRY_HISTORY));
      dispatch(setTargetMinistryDetailHistory(DEFAULT_MINISTRY_DETAIL_HISTORY));

      setIsDetailOpened(false);
      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setIsToastShown(true));
      dispatch(setToastBackgroundColor(BLACK));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  const onClickDeleteMinistry = () => {
    setIsDeleteOpened(true);
  };

  const onClickDeleteConfirm = async () => {
    try {
      ministryHistoryApi.deleteMinistryDetailHistory({
        churchId,
        memberId: targetMember.id,
        ministryGroupHistoryId: targetMinistryHistory.id,
        detailHistoryId: targetMinistryDetailHistory.id,
      });

      const newDetails = details?.filter(
        (d) => d.id !== targetMinistryDetailHistory.id
      );

      setDetails(newDetails);
      setIsDeleteOpened(false);

      dispatch(setTargetMinistryHistory(DEFAULT_MINISTRY_HISTORY));
      dispatch(setTargetMinistryDetailHistory(DEFAULT_MINISTRY_DETAIL_HISTORY));

      setIsDetailOpened(false);
      dispatch(setToastText(t_popup('deleteComplete')));
      dispatch(setIsToastShown(true));
      dispatch(setToastBackgroundColor(BLACK));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  const onClickDeleteCancel = () => {
    setIsDeleteOpened(false);
  };

  useEffect(() => {
    if (!targetMinistryDetailHistory.startDate) {
      setIsDetailSaveEnabled(false);
      return;
    }

    if (!targetMinistryDetailHistory.endDate) {
      setIsDetailSaveEnabled(false);
      return;
    }

    setIsDetailSaveEnabled(true);
  }, [targetMinistryDetailHistory]);

  // ===================== 세부 ===================== //

  const props = {
    history,
    isOpened,
    onClickDetail,
    details,
    onClickMinistryOpen,
    onClickDetailOpen,
  };

  return (
    <>
      <MinistryHistoryItemView {...props} />

      {/* 그룹 수정 */}
      <CustomPopup
        isShow={isDetailOpened}
        onClickCancel={onClickDetailClose}
        onClickDone={onClickSaveDetail}
        headerTitle={t('title.editHistory')}
        width={500}
        height={500}
        doneDisabled={!isDetailSaveEnabled}
      >
        <>
          {/* 삭제 확인 팝업 */}
          <ConfirmPopup
            title={t_popup('deleteHistoryTitle')}
            body={t_popup('deleteHistoryBody')}
            buttonNum={2}
            isShow={isDeleteOpened}
            onClickLeftButton={onClickDeleteCancel}
            onClickRightButton={onClickDeleteConfirm}
            leftButtonText={t_button('cancel')}
            rightButtonText={t_button('delete')}
          />
          <EditMinistryDetailHistory
            onClickDeleteMinistry={onClickDeleteMinistry}
          />
        </>
      </CustomPopup>
    </>
  );
};

export default MinistryHistoryItem;
