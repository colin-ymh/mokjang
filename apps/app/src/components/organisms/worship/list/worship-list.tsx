import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import {
  fetchWorships,
  setWorshipPage,
} from '../../../../redux/reducers/filter/worship-filter-reducer';

import WorshipListView from './worship-list.view';
import { setTargetWorship } from '../../../../redux/reducers/target/target-worship-reducer';
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

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    dispatch(fetchWorships());
  }, [worshipPage]);

  const props = {
    list: {
      worships,
      onClickWorshipItem,
      loadWorships,
    },
  };

  return (
    <>
      <WorshipListView {...props} />
    </>
  );
};

export default WorshipList;
