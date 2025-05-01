import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchVisitations,
  setVisitations,
} from '@/redux/reducers/visitation-filter-reducer';

import { VisitationsApi } from '@/api/visitations/visitations.api';
import VisitationListView from '@/components/organisms/visitation/list/visitation-list.view';
import { DEFAULT_VISITATION, Visitation } from '@/models/visitation/visitation';
import { setTargetVisitation } from '@/redux/reducers/target-visitation';

type VisitationListProps = {
  isNewVisitation?: boolean;
};

const VisitationList = ({ isNewVisitation }: VisitationListProps) => {
  const visitationsApi = new VisitationsApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const {
    visitations,
    visitationFilter,
    visitationOrderBy,
    visitationOrderDirection,
  } = useSelector((state: RootState) => state.visitationFilter);
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 교인 상세정보 팝업 On/Off
  const [isVisitationInformationShown, setIsVisitationInformationShown] =
    useState<boolean>(false);

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  // 무한 스크롤로 데이터 추가 로드
  const loadVisitations = async () => {
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchVisitations({ churchId, currentPage: page + 1 })
      );
      if (fetchVisitations.fulfilled.match(result)) {
        const newVisitations: Visitation[] = result.payload;
        if (newVisitations.length > 0) {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(
            visitations.map((visitation) => visitation.id)
          );
          const filteredNewVisitations = newVisitations.filter(
            (visitation) => !existingIds.has(visitation.id)
          );
          dispatch(setVisitations([...visitations, ...filteredNewVisitations]));
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
    const fetchInitialVisitations = async () => {
      try {
        const result = await dispatch(
          fetchVisitations({ churchId, currentPage: 1 })
        );
        if (fetchVisitations.fulfilled.match(result)) {
          dispatch(setVisitations(result.payload));
          setPage(1);
        }
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    fetchInitialVisitations();
  }, [
    churchId,
    visitationFilter,
    visitationOrderBy,
    visitationOrderDirection,
    isNewVisitation,
  ]);

  // 목록에서 교인을 선택하여 상세 페이지로 이동
  const onClickVisitationItem = async (visitationId: string) => {
    try {
      const response = await visitationsApi.getVisitation({
        churchId,
        visitationId,
      });
      const visitation = response.data;

      dispatch(setTargetVisitation(visitation));
      setIsVisitationInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickClose = () => {
    setIsVisitationInformationShown(false);
    dispatch(setTargetVisitation(DEFAULT_VISITATION));
  };

  // 교인 삭제하기
  const onClickDelete = async () => {
    try {
      const response = await visitationsApi.deleteVisitation({
        churchId,
        visitationId: targetVisitation.id,
      });
      if (response.status === 200) {
        // 초기화 후 다시 로드
        setPage(1);
        const result = await dispatch(
          fetchVisitations({ churchId, currentPage: 1 })
        );
        if (fetchVisitations.fulfilled.match(result)) {
          dispatch(setVisitations(result.payload));
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetVisitation(DEFAULT_VISITATION));
      setIsVisitationInformationShown(false);
    }
  };

  useEffect(() => {
    setIsPopupShown(false);
  }, [targetVisitation]);

  const props = {
    list: {
      onClickVisitationItem,
      loadVisitations,
    },
    information: {
      isVisitationInformationShown,
      isLoading,
      isPopupShown,
      onClickClose,
      onClickDelete,
      onClickConfirmOpen,
      onClickConfirmClose,
    },
  };

  return (
    <>
      <VisitationListView {...props} />
    </>
  );
};

export default VisitationList;
