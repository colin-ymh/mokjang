import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import {
  fetchWorships,
  setWorshipPage,
} from '../../../../redux/reducers/filter/worship-filter-reducer';

import WorshipListView from './worship-list.view';
import { DEFAULT_WORSHIP } from '../../../../models/worship/worship';
import { setTargetWorship } from '../../../../redux/reducers/target/target-worship-reducer';
import {
  setIsToastShown,
  setToastText,
} from '../../../../redux/reducers/toast-popup-reducer';
import { useScopedI18n } from '../../../../../locales/client';
import { WorshipsApi } from '../../../../api/worship/worships.api';

type WorshipListProps = {
  isNewWorship?: boolean;
};

const WorshipList = ({ isNewWorship }: WorshipListProps) => {
  const worshipApi = new WorshipsApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const {
    worships,
    worshipPage,
    worshipFilter,
    worshipOrderBy,
    worshipOrderDirection,
  } = useSelector((state: RootState) => state.worshipFilter);
  const { targetWorship } = useSelector(
    (state: RootState) => state.targetWorship
  );

  const t_popup = useScopedI18n('popup');

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 교인 상세정보 팝업 On/Off
  const [isWorshipInformationShown, setIsWorshipInformationShown] =
    useState<boolean>(false);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  // 개인정보 수정 모달
  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  // 무한 스크롤로 데이터 추가 로드
  const loadWorships = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await dispatch(setWorshipPage(worshipPage + 1));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 정보가 변경될 때, 교인들을 다시 불러오는 부분
  useEffect(() => {
    const fetchInitialWorships = async () => {
      try {
        await dispatch(setWorshipPage(1));
        await dispatch(fetchWorships());
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };
    fetchInitialWorships();
  }, [worshipFilter, worshipOrderBy, worshipOrderDirection, isNewWorship]);

  // 목록에서 교인을 선택하여 상세 페이지로 이동
  const onClickWorshipItem = async (worshipId: string) => {
    try {
      const response = await worshipApi.getWorship({ churchId, worshipId });
      const worship = response.data.data;

      dispatch(setTargetWorship(worship));
      dispatch(setTargetWorship(worship));
      setIsWorshipInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickClose = () => {
    setIsWorshipInformationShown(false);
    dispatch(setTargetWorship(DEFAULT_WORSHIP));
  };

  // 교인 삭제하기
  const onClickDelete = async () => {
    try {
      await worshipApi.deleteWorship({
        churchId,
        worshipId: targetWorship.id,
      });

      // 초기화 후 다시 로드
      dispatch(setWorshipPage(1));
      // 삭제 후 재로딩
      await dispatch(fetchWorships());
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetWorship(DEFAULT_WORSHIP));
      setIsWorshipInformationShown(false);
    }
  };

  const onClickEditOpen = () => {
    dispatch(setTargetWorship(targetWorship));
    setIsEditShown(true);
  };

  const onClickEditClose = async () => {
    const worshipApi = new WorshipsApi(false);
    setIsEditShown(false);
    const response = await worshipApi.getWorship({
      churchId,
      worshipId: targetWorship.id,
    });
    const newWorship = response.data.data;
    dispatch(setTargetWorship(newWorship));
  };

  const onClickEditDone = async () => {
    try {
      await worshipApi
        .editWorship(
          { churchId, worshipId: targetWorship.id },
          {
            title: targetWorship.title || undefined,
            description: targetWorship.description || undefined,
            worshipDay: targetWorship.worshipDay || undefined,
            repeatPeriod: targetWorship.repeatPeriod || undefined,
            worshipTargetGroupIds:
              targetWorship.worshipTargetGroupIds || undefined,
          }
        )
        .then((response) => {
          const newWorship = response.data.data;
          dispatch(setTargetWorship(newWorship));
          dispatch(fetchWorships());
          setIsEditShown(false);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setIsToastShown(true));
      dispatch(setToastText(t_popup('saveComplete')));
    }
  };

  useEffect(() => {
    setIsPopupShown(false);
  }, [targetWorship]);

  useEffect(() => {
    dispatch(fetchWorships());
  }, [worshipPage]);

  const props = {
    list: {
      worships,
      onClickWorshipItem,
      loadWorships,
    },
    information: {
      isWorshipInformationShown,
      isLoading,
      isPopupShown,
      isEditShown,
      onClickEditOpen,
      onClickEditClose,
      onClickEditDone,
      onClickClose,
      onClickDelete,
      onClickConfirmOpen,
      onClickConfirmClose,
    },
  };

  return (
    <>
      <WorshipListView {...props} />
    </>
  );
};

export default WorshipList;
