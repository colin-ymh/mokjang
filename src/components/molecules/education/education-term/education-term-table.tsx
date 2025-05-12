import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { ORDER_DIRECTION } from '@/constants/constant';
import { EDUCATION_TERM } from '@/constants/education/education-term-column';
import {
  setEducationTermOrderBy,
  setEducationTermOrderDirection,
} from '@/redux/reducers/education-term-filter-reducer';
import EducationTermTableView from '@/components/molecules/education/education-term/education-term-table.view';

export type EducationTermTableProps = {
  onClickEducationTermItem: (educationTermId: string) => void;
  loadEducationTerms: () => Promise<void>;
};

const EducationTermTable = ({
  onClickEducationTermItem,
  loadEducationTerms,
}: EducationTermTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    educationTerms,
    educationTermFilter,
    educationTermOrderBy,
    educationTermOrderDirection,
  } = useSelector((state: RootState) => state.educationTermFilter);

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: EDUCATION_TERM) => {
    let newOrderBy = id;

    if (newOrderBy !== educationTermOrderBy) {
      dispatch(setEducationTermOrderBy(newOrderBy));
      dispatch(setEducationTermOrderDirection(ORDER_DIRECTION.ASC));
    } else {
      dispatch(
        setEducationTermOrderDirection(
          educationTermOrderDirection === ORDER_DIRECTION.ASC
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
        loadEducationTerms(); // 데이터를 추가로 로드
      }
    }
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [educationTermOrderBy, educationTermOrderDirection, educationTermFilter]);

  const props = {
    educationTerms,
    onClickHeader,
    onClickEducationTermItem,
    scrollRef,
    onScroll,
  };

  return (
    <>
      <EducationTermTableView {...props} />
    </>
  );
};

export default EducationTermTable;
