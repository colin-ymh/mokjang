import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { HEADER_BAR } from '../../../../constants/constant';
import {
  fetchJoinRequests,
  setJoinRequests,
} from '../../../../redux/reducers/filter/join-request-filter-reducer';
import { JoinRequest } from '../../../../models/join-request/join-request';
import JoinRequestListView from './join-request-list.view';
import { STATUS } from '../../../../constants/status/status';

type JoinRequestListProps = {
  headerType?: HEADER_BAR;
};

const JoinRequestList = ({
  headerType = HEADER_BAR.ALL,
}: JoinRequestListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const {
    joinRequests,
    joinRequestFilter,
    joinRequestOrderBy,
    joinRequestOrderDirection,
  } = useSelector((state: RootState) => state.joinRequestFilter);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 무한 스크롤로 데이터 추가 로드
  const loadJoinRequests = async () => {
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchJoinRequests({
          currentPage: page + 1,
          status: STATUS.PENDING,
        })
      );
      if (fetchJoinRequests.fulfilled.match(result)) {
        const newJoinRequests: JoinRequest[] = result.payload;
        if (newJoinRequests.length > 0) {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(
            joinRequests.map((joinRequest) => joinRequest.id)
          );
          const filteredNewJoinRequests = newJoinRequests.filter(
            (joinRequest) => !existingIds.has(joinRequest.id)
          );
          dispatch(
            setJoinRequests([...joinRequests, ...filteredNewJoinRequests])
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

  // 필터 정보가 변경될 때, 교인들을 다시 불러오는 부분
  useEffect(() => {
    const fetchInitialJoinRequests = async () => {
      try {
        const result = await dispatch(
          fetchJoinRequests({
            currentPage: 1,
            status: STATUS.PENDING,
          })
        );
        if (fetchJoinRequests.fulfilled.match(result)) {
          dispatch(setJoinRequests(result.payload));
          setPage(1);
        }
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    fetchInitialJoinRequests();
  }, [
    joinRequestFilter,
    joinRequestOrderBy,
    joinRequestOrderDirection,
    headerType === HEADER_BAR.MY,
  ]);

  const props = {
    list: {
      loadJoinRequests,
    },
    information: {
      isLoading,
    },
  };

  return (
    <>
      <JoinRequestListView {...props} />
    </>
  );
};

export default JoinRequestList;
