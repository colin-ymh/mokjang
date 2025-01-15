import React, { useEffect, useRef, useState } from 'react';

import {
  DEFAULT_EDUCATION_ENROLLMENT,
  EducationEnrollment,
} from '@/models/management/management';
import EnrollmentTableView from '@/components/molecules/management/education/enrollment-table.view';
import { EDUCATION_ENROLLMENT } from '@/constants/management/education-term-column';

export type EnrollmentTableProps = {
  enrollments: EducationEnrollment[];
  isInformation: boolean;
};

const EnrollmentTable = ({
  enrollments,
  isInformation,
}: EnrollmentTableProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 상세 모달 활성화 여부
  const [isDetailModalShown, setIsDetailModalShown] = useState<boolean>(false);

  // 선택된 인원
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<EducationEnrollment>(DEFAULT_EDUCATION_ENROLLMENT);

  // 기수 클릭 시 이벤트
  const onClickEnrollment = (enrollment: EducationEnrollment) => {
    setIsDetailModalShown(true);
    setSelectedEnrollment(enrollment);
  };

  // 모달 닫기
  const onClickClose = () => {
    setIsDetailModalShown(false);
  };

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: EDUCATION_ENROLLMENT) => {};

  // 스크롤 시 이벤트
  const onScroll = () => {};

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  const props = {
    enrollments,
    isInformation,
    onClickEnrollment,
    onClickHeader,
    scrollRef,
    onScroll,
  };

  return (
    <>
      <EnrollmentTableView {...props} />
      {/*<CustomPopup*/}
      {/*  isShow={isDetailModalShown}*/}
      {/*  onClickClose={onClickClose}*/}
      {/*  width={70}*/}
      {/*  height={90}*/}
      {/*  isPercentage={true}*/}
      {/*>*/}
      {/*</CustomPopup>*/}
    </>
  );
};

export default EnrollmentTable;
