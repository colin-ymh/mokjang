import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../../redux/store';
import React, { useEffect, useRef, useState } from 'react';
import { DEFAULT_MINISTRY_HISTORY, MinistryHistory } from '@mokjang/models';
import { setTargetMinistryHistory } from '../../../../../../redux/reducers/target/target-history-reducer';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '../../../../../../redux/reducers/toast-popup-reducer';
import { BLACK, DESTRUCTIVE } from '@mokjang/constants';
import { getDateFromDateString, getDateStringFromDate } from '@mokjang/utils';
import { CustomPopup } from '@mokjang/components';
import { useI18n, useScopedI18n } from '../../../../../../../locales/client';
import ConfirmPopup from '../../../../../atoms/common/popup/error-popup';
import { MinistryHistoryApi } from '../../../../../../api/history/ministry-history.api';
import MinistryHistoryListView from './ministry-history-list.view';
import EditMinistryHistory from './edit-ministry-history';

const TAKE = 10;

const MinistryHistoryList = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');

  const dispatch = useDispatch<AppDispatch>();
  const ministryHistoryApi = new MinistryHistoryApi(false);

  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const { targetMinistryHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false); // 초기 false로 첫 로딩 허용
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [histories, setHistories] = useState<MinistryHistory[]>([]);

  const [isMinistryOpened, setIsMinistryOpened] = useState<boolean>(false);

  const [isMinistrySaveEnabled, setIsMinistrySaveEnabled] =
    useState<boolean>(false);

  const [isDeleteOpened, setIsDeleteOpened] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const fetchHistory = async () => {
    // 이미 로딩 중이거나 더 불러올 데이터가 없다면 중단
    if (isLoading || !hasMore) return;

    // churchId/targetMember 없으면 중단
    if (!churchId || !targetMember?.id) return;

    setIsLoading(true);
    try {
      const response = await ministryHistoryApi.getMinistryGroupHistory({
        churchId,
        memberId: targetMember.id,
        take: TAKE,
        page,
      });

      const newHistories = (response?.data?.data ?? []) as MinistryHistory[];

      if (page === 1) {
        // 첫 페이지는 교체
        setHistories(newHistories);
      } else {
        // 이후 페이지는 append + dedup(id)
        setHistories((prev) => {
          const exist = new Set(prev.map((h) => h.id));
          const append = newHistories.filter((h) => !exist.has(h.id));
          return prev.concat(append);
        });
      }

      // hasMore 갱신
      if (!newHistories.length || newHistories.length < TAKE) {
        setHasMore(false);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // targetMember가 바뀌면 초기화 후 재로딩
  useEffect(() => {
    setPage(1);
    setHistories([]);
    setHasMore(true);
    setIsLoading(false);
    // page가 1이라도 fetchHistory는 page 의존 effect에서 호출됨
  }, [targetMember?.id, churchId]);

  // 페이지 변경 시 로딩
  useEffect(() => {
    fetchHistory();
  }, [page]);

  // 스크롤 이벤트: ref가 없으면 window 스크롤로 폴백
  useEffect(() => {
    const container = scrollRef.current;
    const threshold = 16; // px

    const isNearBottom = () => {
      if (container) {
        const isScrollable =
          container.scrollHeight > container.clientHeight + 1;
        if (!isScrollable) return false;
        return (
          container.scrollTop + container.clientHeight >=
          container.scrollHeight - threshold
        );
      } else {
        const doc = document.documentElement;
        return (
          window.scrollY + window.innerHeight >= doc.scrollHeight - threshold
        );
      }
    };

    const onScroll = () => {
      if (isLoading || !hasMore) return;
      if (!isNearBottom()) return;
      setPage((prev) => prev + 1);
    };

    const target: any = container ?? window;
    target.addEventListener('scroll', onScroll);
    return () => {
      target.removeEventListener('scroll', onScroll);
    };
  }, [isLoading, hasMore]); // ref 객체는 고정이라 deps에 불필요

  // ===================== 그룹 ===================== //
  const onClickMinistryOpen = (history: MinistryHistory) => {
    setIsMinistryOpened(true);
    dispatch(
      setTargetMinistryHistory({
        ...history,
        startDate: getDateStringFromDate(
          getDateFromDateString(history.startDate)
        ),
      })
    );
  };
  const onClickMinistryClose = () => {
    setIsMinistryOpened(false);
    dispatch(setTargetMinistryHistory(DEFAULT_MINISTRY_HISTORY));
  };

  const onClickSaveMinistry = async () => {
    try {
      const response = await ministryHistoryApi.editMinistryGroupHistory(
        {
          churchId,
          memberId: targetMember.id,
          ministryGroupHistoryId: targetMinistryHistory.id,
        },
        {
          startDate: getDateStringFromDate(
            getDateFromDateString(targetMinistryHistory.startDate)
          ),
          endDate: getDateStringFromDate(
            getDateFromDateString(targetMinistryHistory.endDate)
          ),
        }
      );

      const newHistory = response.data.data;

      const newHistories = histories.map((h) => {
        if (h.id === newHistory.id) {
          return newHistory;
        } else {
          return h;
        }
      });

      setHistories(newHistories);

      dispatch(setTargetMinistryHistory(DEFAULT_MINISTRY_HISTORY));

      setIsMinistryOpened(false);
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
      ministryHistoryApi.deleteMinistryGroupHistory({
        churchId,
        memberId: targetMember.id,
        ministryGroupHistoryId: targetMinistryHistory.id,
      });

      const newHistories = histories.filter(
        (h) => h.id !== targetMinistryHistory.id
      );

      setHistories(newHistories);
      setIsMinistryOpened(false);
      setIsDeleteOpened(false);

      dispatch(setTargetMinistryHistory(DEFAULT_MINISTRY_HISTORY));

      setIsMinistryOpened(false);
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
    if (!targetMinistryHistory.startDate) {
      setIsMinistrySaveEnabled(false);
      return;
    }

    if (!targetMinistryHistory.endDate) {
      setIsMinistrySaveEnabled(false);
      return;
    }

    setIsMinistrySaveEnabled(true);
  }, [targetMinistryHistory]);

  // ===================== 그룹 ===================== //

  const props = {
    scrollRef,
    histories,
    onClickMinistryOpen,
  };

  return (
    <>
      <MinistryHistoryListView {...props} />

      {/* 그룹 수정 */}
      <CustomPopup
        isShow={isMinistryOpened}
        onClickCancel={onClickMinistryClose}
        onClickDone={onClickSaveMinistry}
        headerTitle={t('title.editHistory')}
        width={500}
        height={500}
        doneDisabled={!isMinistrySaveEnabled}
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
          <EditMinistryHistory onClickDeleteMinistry={onClickDeleteMinistry} />
        </>
      </CustomPopup>
    </>
  );
};

export default MinistryHistoryList;
