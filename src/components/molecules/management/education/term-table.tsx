import React, { useEffect, useRef, useState } from 'react';

import TermTableView from '@/components/molecules/management/education/term-table.view';
import {
  DEFAULT_EDUCATION_TERM,
  Education,
  EducationTerm,
} from '@/models/management/management';
import { EDUCATION_TERM } from '@/constants/management/education-term-column';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import TermInformation from '@/components/molecules/management/education/term-information';

export type TermTableProps = {
  education: Education;
  terms: EducationTerm[];
};

const TermTable = ({ education, terms }: TermTableProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 상세 모달 활성화 여부
  const [isDetailModalShown, setIsDetailModalShown] = useState<boolean>(true);

  // 선택된 기수
  const [selectedTerm, setSelectedTerm] = useState<EducationTerm>(
    DEFAULT_EDUCATION_TERM
  );

  // 기수 클릭 시 이벤트
  const onClickTerm = (term: EducationTerm) => {
    setIsDetailModalShown(true);
    setSelectedTerm(term);
  };

  // 모달 닫기
  const onClickClose = () => {
    setIsDetailModalShown(false);
  };

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: EDUCATION_TERM) => {};

  // 스크롤 시 이벤트
  const onScroll = () => {};

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  const props = {
    terms,
    onClickHeader,
    scrollRef,
    onScroll,
  };

  return (
    <>
      <TermTableView {...props} />
      <CustomPopup
        isShow={isDetailModalShown}
        onClickClose={onClickClose}
        width={70}
        height={90}
        isPercentage={true}
      >
        <TermInformation education={education} term={selectedTerm} />
      </CustomPopup>
    </>
  );
};

export default TermTable;
