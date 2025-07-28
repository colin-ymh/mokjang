import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import EducationTableView from '@/components/molecules/education/education/education-table.view';

export type EducationTableProps = {
  loadEducations: () => void;
};

const EducationTable = ({ loadEducations }: EducationTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      // 스크롤이 최하단에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight) {
        loadEducations(); // 데이터를 추가로 로드
      }
    }
  };

  // 열려있는 교육 목록
  const [openedEducationIds, setOpenedEducationIds] = useState<string[]>([]);

  // 열려있는 교육 기수 목록
  const [openedTermIds, setOpenedTermIds] = useState<string[]>([]);

  // 교육 열고 닫기
  const onClickEducationChevron = (educationId: string) => {
    if (openedEducationIds.includes(educationId)) {
      setOpenedEducationIds(
        openedEducationIds.filter((id) => id !== educationId)
      );
    } else {
      setOpenedEducationIds([...openedEducationIds, educationId]);
    }
  };

  // 교육 기수 열고 닫기
  const onClickTermChevron = (termId: string) => {
    if (openedTermIds.includes(termId)) {
      setOpenedTermIds(openedTermIds.filter((id) => id !== termId));
    } else {
      setOpenedTermIds([...openedTermIds, termId]);
    }
  };

  const props = {
    openedEducationIds,
    openedTermIds,
    onClickEducationChevron,
    onClickTermChevron,
    scrollRef,
    onScroll,
  };

  return (
    <>
      <EducationTableView {...props} />
    </>
  );
};

export default EducationTable;
