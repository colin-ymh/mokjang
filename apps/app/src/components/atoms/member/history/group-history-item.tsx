import {
  DEFAULT_GROUP_DETAIL_HISTORY,
  DEFAULT_GROUP_HISTORY,
  GroupDetailHistory,
  GroupHistory,
} from '@mokjang/models';
import React, { useEffect, useState } from 'react';
import { GroupHistoryApi } from '@/api/history/group-history.api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import GroupHistoryItemView from './group-history-item.view';
import {
  setTargetGroupDetailHistory,
  setTargetGroupHistory,
} from '@/redux/reducers/target/target-history-reducer';
import { getDateFromDateString, getDateStringFromDate } from '@mokjang/utils';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { BLACK, DESTRUCTIVE } from '@mokjang/constants';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { CustomPopup } from '@mokjang/components';
import ConfirmPopup from '../../common/popup/error-popup';
import EditGroupDetailHistory from '../../../molecules/member/information/history/group/edit-group-detail-history';

type GroupHistoryItemProps = {
  history: GroupHistory;
  onClickGroupOpen: (history: GroupHistory) => void;
};

const GroupHistoryItem = ({
  history,
  onClickGroupOpen,
}: GroupHistoryItemProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');

  const dispatch = useDispatch<AppDispatch>();
  const groupHistoryApi = new GroupHistoryApi(false);

  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const { targetGroupDetailHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  const [isDetailOpened, setIsDetailOpened] = useState<boolean>(false);

  const [isDetailSaveEnabled, setIsDetailSaveEnabled] =
    useState<boolean>(false);

  const [isDeleteOpened, setIsDeleteOpened] = useState<boolean>(false);

  const [details, setDetails] = useState<GroupDetailHistory[] | undefined>(
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
        const response = await groupHistoryApi.getGroupDetailHistory({
          churchId,
          memberId: targetMember.id,
          groupHistoryId: history.id,
        });

        const newDetails = response.data.data;

        setDetails(newDetails);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // ===================== 세부 ===================== //

  const onClickDetailOpen = (history: GroupDetailHistory) => {
    setIsDetailOpened(true);
    dispatch(
      setTargetGroupDetailHistory({
        ...history,
        startDate: getDateStringFromDate(
          getDateFromDateString(history.startDate)
        ),
      })
    );
  };
  const onClickDetailClose = () => {
    setIsDetailOpened(false);
    dispatch(setTargetGroupDetailHistory(DEFAULT_GROUP_DETAIL_HISTORY));
  };

  const onClickSaveDetail = async () => {
    try {
      const response = await groupHistoryApi.editGroupDetailHistory(
        {
          churchId,
          memberId: targetMember.id,
          groupHistoryId: targetGroupDetailHistory.groupHistoryId,
          detailHistoryId: targetGroupDetailHistory.id,
        },
        {
          startDate: getDateStringFromDate(
            getDateFromDateString(targetGroupDetailHistory.startDate)
          ),
          endDate: getDateStringFromDate(
            getDateFromDateString(targetGroupDetailHistory.endDate)
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

      dispatch(setTargetGroupHistory(DEFAULT_GROUP_HISTORY));

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

  const onClickDeleteGroup = () => {
    setIsDeleteOpened(true);
  };

  const onClickDeleteConfirm = async () => {
    try {
      groupHistoryApi.deleteGroupDetailHistory({
        churchId,
        memberId: targetMember.id,
        groupHistoryId: targetGroupDetailHistory.groupHistoryId,
        detailHistoryId: targetGroupDetailHistory.id,
      });

      const newDetails = details?.filter(
        (d) => d.id !== targetGroupDetailHistory.id
      );

      setDetails(newDetails);
      setIsDeleteOpened(false);

      dispatch(setTargetGroupDetailHistory(DEFAULT_GROUP_DETAIL_HISTORY));

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
    if (!targetGroupDetailHistory.startDate) {
      setIsDetailSaveEnabled(false);
      return;
    }

    if (!targetGroupDetailHistory.endDate) {
      setIsDetailSaveEnabled(false);
      return;
    }

    setIsDetailSaveEnabled(true);
  }, [targetGroupDetailHistory]);

  // ===================== 세부 ===================== //

  const props = {
    history,
    isOpened,
    onClickDetail,
    details,
    onClickGroupOpen,
    onClickDetailOpen,
  };

  return (
    <>
      <GroupHistoryItemView {...props} />

      {/* 그룹 수정 */}
      <CustomPopup
        isShow={isDetailOpened}
        onClickClose={onClickDetailClose}
        onClickCancel={onClickDetailClose}
        onClickDone={onClickSaveDetail}
        headerTitle={t('title.editHistory')}
        width={500}
        height={500}
        doneDisabled={!isDetailSaveEnabled}
        cancelText={t_button('cancel')}
        doneText={t_button('confirm')}
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
          <EditGroupDetailHistory onClickDeleteGroup={onClickDeleteGroup} />
        </>
      </CustomPopup>
    </>
  );
};

export default GroupHistoryItem;
