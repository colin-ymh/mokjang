import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import {
  setVisitationOrderBy,
  setVisitationOrderDirection,
} from '../../../redux/reducers/filter/visitation-filter-reducer';

import VisitationTableView from './visitation-table.view';
import { VISITATION } from '@mokjang/constants';
import { ORDER_DIRECTION } from '@mokjang/constants';

export type VisitationTableProps = {
  onClickVisitationItem: (visitationId: string) => void;
  loadVisitations: () => Promise<void>;
};

const VisitationTable = ({
  onClickVisitationItem,
  loadVisitations,
}: VisitationTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    visitations,
    visitationFilter,
    visitationOrderBy,
    visitationOrderDirection,
  } = useSelector((state: RootState) => state.visitationFilter);

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: VISITATION) => {
    let newOrderBy = id;

    if (newOrderBy !== visitationOrderBy) {
      dispatch(setVisitationOrderBy(newOrderBy));
      dispatch(setVisitationOrderDirection(ORDER_DIRECTION.ASC));
    } else {
      dispatch(
        setVisitationOrderDirection(
          visitationOrderDirection === ORDER_DIRECTION.ASC
            ? ORDER_DIRECTION.DESC
            : ORDER_DIRECTION.ASC
        )
      );
    }
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      // 스크롤이 최하단에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight) {
        loadVisitations(); // 데이터를 추가로 로드
      }
    }
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [visitationOrderBy, visitationOrderDirection, visitationFilter]);

  const props = {
    visitations,
    onClickHeader,
    onClickVisitationItem,
    scrollRef,
    onScroll,
  };

  return (
    <>
      <VisitationTableView {...props} />
    </>
  );
};

export default VisitationTable;
