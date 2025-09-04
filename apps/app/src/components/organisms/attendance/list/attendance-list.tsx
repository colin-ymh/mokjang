import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import {
  fetchWorshipEnrollments,
  setWorshipEnrollments,
  setWorshipEnrollmentTotalCount,
} from '../../../../redux/reducers/filter/worship-enrollment-filter-reducer';
import { WorshipEnrollment } from '@mokjang/models';
import AttendanceListView from './attendance-list.view';
import { Loading } from '@mokjang/components';
type AttendanceListProps = {};

const AttendanceList = ({}: AttendanceListProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
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
  if (thrownError) {
    throw thrownError;
  }

  const [isStatisticOpened, setIsStatisticOpened] = useState<boolean>(false);

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClickStatisticChevron = () => {
    setIsStatisticOpened(!isStatisticOpened);
  };

  // 무한 스크롤로 데이터 추가 로드
  const loadWorshipEnrollments = async () => {
    if (!targetWorship.id) return;
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchWorshipEnrollments({
          churchId,
          currentPage: page + 1,
          worshipId: targetWorship.id,
        })
      );
      if (fetchWorshipEnrollments.fulfilled.match(result)) {
        const newWorshipEnrollments: WorshipEnrollment[] = result.payload.data;
        const totalCount = result.payload.totalCount;
        dispatch(setWorshipEnrollmentTotalCount(totalCount));
        if (newWorshipEnrollments.length > 0) {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(
            worshipEnrollments.map((worshipEnrollment) => worshipEnrollment.id)
          );
          const filteredNewAttendances = newWorshipEnrollments.filter(
            (enrollment) => !existingIds.has(enrollment.id)
          );
          dispatch(
            setWorshipEnrollments([
              ...worshipEnrollments,
              ...filteredNewAttendances,
            ])
          );
          setPage((prev) => prev + 1); // 다음 페이지로 이동
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 정보가 변경될 때, 출석부를 다시 불러오는 부분
  useEffect(() => {
    if (targetWorship.id) {
      const fetchInitialEnrollments = async () => {
        try {
          const result = await dispatch(
            fetchWorshipEnrollments({
              churchId,
              currentPage: 1,
              worshipId: targetWorship.id,
            })
          );
          if (fetchWorshipEnrollments.fulfilled.match(result)) {
            dispatch(setWorshipEnrollments(result.payload.data));
            const totalCount = result.payload.totalCount;
            dispatch(setWorshipEnrollmentTotalCount(totalCount));
            setPage(1);
          }
        } catch (error) {
          setThrownError(
            error instanceof Error ? error : new Error(String(error))
          );
        }
      };

      fetchInitialEnrollments();
    } else {
      dispatch(setWorshipEnrollments([]));
    }
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
    },
    information: {},
  };

  return (
    <>
      <AttendanceListView {...props} />
      <Loading isShow={isLoading} />
    </>
  );
};

export default AttendanceList;
