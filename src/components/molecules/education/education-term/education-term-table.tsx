import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { BLANK, ORDER_DIRECTION } from '@/constants/constant';
import { EDUCATION_TERM } from '@/constants/education/education-column';
import {
  setEducationTermOrderBy,
  setEducationTermOrderDirection,
} from '@/redux/reducers/filter/education-term-filter-reducer';
import EducationTermTableView from '@/components/molecules/education/education-term/education-term-table.view';
import { EducationSessionsApi } from '@/api/education/education-sessions.api';
import { EducationTerm } from '@/models/education/education';

export type EducationTermTableProps = {
  onClickEducationTermItem: (educationTermId: string) => void;
  loadEducationTerms: () => Promise<void>;
  onClickEducationSessionItem: (
    educationTermId: string,
    educationSessionId: string
  ) => void;
  onClickOpenAddEducationSession: (educationTerm?: EducationTerm) => void;
};

const EducationTermTable = ({
  onClickEducationTermItem,
  loadEducationTerms,
  onClickEducationSessionItem,
  onClickOpenAddEducationSession,
}: EducationTermTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const educationSessionsApi = new EducationSessionsApi(false);
  const [openedTermId, setOpenedTermId] = useState<string>(BLANK);
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const { churchId } = useSelector((state: RootState) => state.church);
  const {
    educationTerms,
    educationTermFilter,
    educationTermOrderBy,
    educationTermOrderDirection,
  } = useSelector((state: RootState) => state.educationTermFilter);

  const onClickTermChevron = (termId: string) => {
    if (openedTermId === termId) {
      setOpenedTermId(BLANK);
    } else {
      // educationSessionsApi
      //   .getEducationSessions({
      //     churchId,
      //     educationId: targetEducation.id,
      //     educationTermId: termId,
      //   })
      //   .then((response) => {
      //     const newSessions = response.data;
      //
      //     const newEducationTerms = educationTerms.map((term) => {
      //       if (term.id === termId) {
      //         return { ...term, educationSessions: newSessions };
      //       } else {
      //         return term;
      //       }
      //     });
      //
      //     dispatch(setEducationTerms(newEducationTerms));
      //   });
      setOpenedTermId(termId);
    }
  };

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
    openedTermId,
    educationTerms,
    onClickTermChevron,
    onClickHeader,
    onClickEducationTermItem,
    onClickEducationSessionItem,
    scrollRef,
    onScroll,
    onClickOpenAddEducationSession,
  };

  return (
    <>
      <EducationTermTableView {...props} />
    </>
  );
};

export default EducationTermTable;
