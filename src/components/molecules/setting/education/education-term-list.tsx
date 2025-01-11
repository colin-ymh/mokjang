import { useEffect, useState } from 'react';

import { Education } from '@/models/setting/setting';
import EducationTermListView from '@/components/molecules/setting/education/education-term-list.view';

type EducationTermProps = {
  education: Education;
};

const EducationTermList = ({ education }: EducationTermProps) => {
  // 기수 목록
  const [terms, setTerms] = useState<any>([]);

  // 기수 추가를 위한 모달 활성화 여부
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  // 기수 추가 모달 열기
  const onClickModalOpen = () => {
    setIsModalShown(true);
  };

  // 기수 추가 모달 닫기
  const onClickModalClose = () => {
    setIsModalShown(false);
  };

  // 기수들 불러오기
  useEffect(() => {}, [education]);

  const props = {
    education,
    terms,
    isModalShown,
    onClickModalOpen,
    onClickModalClose,
  };

  return (
    <>
      <EducationTermListView {...props} />
    </>
  );
};

export default EducationTermList;
