import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchWorships,
  setWorships,
} from '@/redux/reducers/filter/worship-filter-reducer';

import { Worship } from '@/models/worship/worship';
import WorshipListView from '@/components/organisms/worship/list/worship-list.view';

type WorshipListProps = {
  isNewWorship?: boolean;
};

const WorshipList = ({ isNewWorship }: WorshipListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const { worships, worshipFilter, worshipOrderBy, worshipOrderDirection } =
    useSelector((state: RootState) => state.worshipFilter);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 무한 스크롤로 데이터 추가 로드
  const loadWorships = async () => {
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchWorships({ churchId, currentPage: page + 1 })
      );
      if (fetchWorships.fulfilled.match(result)) {
        const newWorships: Worship[] = result.payload;
        if (newWorships.length > 0) {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(worships.map((worship) => worship.id));
          const filteredNewWorships = newWorships.filter(
            (worship) => !existingIds.has(worship.id)
          );
          dispatch(setWorships([...worships, ...filteredNewWorships]));
          setPage((prev) => prev + 1); // 다음 페이지로 이동
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 정보가 변경될 때, 예배 목록들을 다시 불러오는 부분
  useEffect(() => {
    const fetchInitialWorships = async () => {
      try {
        const result = await dispatch(
          fetchWorships({ churchId, currentPage: 1 })
        );
        if (fetchWorships.fulfilled.match(result)) {
          dispatch(setWorships(result.payload));
          setPage(1);
        }
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    fetchInitialWorships();
  }, [
    churchId,
    worshipFilter,
    worshipOrderBy,
    worshipOrderDirection,
    isNewWorship,
  ]);

  const props = {
    list: {
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
