import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchWorshipEnrollments,
  setWorshipEnrollments,
  setWorshipEnrollmentTotalCount,
} from '@/redux/reducers/filter/worship-enrollment-filter-reducer';
import { WorshipEnrollment } from '@mokjang/models';
import AttendanceListView from './attendance-list.view';
import { Loading } from '@mokjang/components';
import { WorshipEnrollmentsApi } from '@/api/worship/worship-enrollments.api';

type AttendanceListProps = {};

const AttendanceList = ({}: AttendanceListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const worshipEnrollmentsApi = new WorshipEnrollmentsApi(false);

  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const { worships } = useSelector((state: RootState) => state.worshipFilter);
  const {
    worshipEnrollments,
    worshipEnrollmentFilter,
    worshipEnrollmentOrderBy,
    worshipEnrollmentOrderDirection,
  } = useSelector((state: RootState) => state.worshipEnrollmentFilter);

  const { targetWorship } = useSelector(
    (state: RootState) => state.targetWorship
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) throw thrownError;

  const [isStatisticOpened, setIsStatisticOpened] = useState<boolean>(true);

  // 서버에서 불러오는 페이지 (1부터 시작)
  const [page, setPage] = useState<number>(1);

  // 공용 로딩 상태 (요청 중엔 모든 추가 요청 가드)
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 더 불러올 데이터 여부
  const [hasMore, setHasMore] = useState<boolean>(true);

  const onClickStatisticChevron = () => {
    setIsStatisticOpened((p) => !p);
  };

  const TAKE = 30;

  // 무한 스크롤 추가 로드
  const loadWorshipEnrollments = async () => {
    if (!targetWorship.id) return;
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const result = await dispatch(
        fetchWorshipEnrollments({
          churchId,
          currentPage: nextPage,
          worshipId: targetWorship.id,
          take: TAKE,
        })
      );

      if (fetchWorshipEnrollments.fulfilled.match(result)) {
        const newWorshipEnrollments: WorshipEnrollment[] =
          result.payload.data ?? [];
        const totalCount: number = result.payload.totalCount ?? 0;

        // 상태 반영
        dispatch(setWorshipEnrollmentTotalCount(totalCount));
        dispatch(
          setWorshipEnrollments([
            ...worshipEnrollments,
            ...newWorshipEnrollments,
          ])
        );
        setPage(nextPage);

        // ✅ 총합 기준으로 hasMore 판정 (더 안전)
        const combinedLen =
          worshipEnrollments.length + newWorshipEnrollments.length;
        setHasMore(combinedLen < totalCount);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 초기/필터 변경 시
  const fetchInitialEnrollments = async () => {
    if (!targetWorship.id) {
      // 초기화
      dispatch(setWorshipEnrollments([]));
      dispatch(setWorshipEnrollmentTotalCount(0));
      setPage(1);
      setHasMore(true);
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await dispatch(
        fetchWorshipEnrollments({
          churchId,
          currentPage: 1,
          worshipId: targetWorship.id,
          take: TAKE,
        })
      );

      if (fetchWorshipEnrollments.fulfilled.match(result)) {
        const firstPageData: WorshipEnrollment[] = result.payload.data ?? [];
        const totalCount: number = result.payload.totalCount ?? 0;

        dispatch(setWorshipEnrollments(firstPageData));
        dispatch(setWorshipEnrollmentTotalCount(totalCount));
        setPage(1);

        // ✅ 첫 로드에서 hasMore 정확히 세팅
        setHasMore(firstPageData.length < totalCount);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  const onClickRefreshEnrollments = async () => {
    if (!targetWorship.id) return;
    if (isLoading) return;

    setIsLoading(true);
    try {
      await worshipEnrollmentsApi.refreshWorshipEnrollments({
        churchId,
        worshipId: targetWorship.id,
      });
      await fetchInitialEnrollments();
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 필터/정렬/대상 예배 변경 시 초기 로드
  useEffect(() => {
    fetchInitialEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    churchId,
    targetWorship.id,
    worshipEnrollmentFilter,
    worshipEnrollmentOrderBy,
    worshipEnrollmentOrderDirection,
  ]);

  const props = {
    list: {
      loadWorshipEnrollments,
      isStatisticOpened,
      onClickStatisticChevron,
      onClickRefreshEnrollments,
    },
    information: {},
  };

  return (
    <>
      {<AttendanceListView {...props} />}
      <Loading isShow={isLoading} />
    </>
  );
};

export default AttendanceList;
