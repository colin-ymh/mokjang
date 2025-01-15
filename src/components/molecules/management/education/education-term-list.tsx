import { useEffect, useState } from 'react';

import { Education } from '@/models/management/management';
import EducationTermListView from '@/components/molecules/management/education/education-term-list.view';
import { EducationTermsApi } from '@/api/management/education/education-terms.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type EducationTermProps = {
  education: Education;
};

const EducationTermList = ({ education }: EducationTermProps) => {
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const educationTermsApi = new EducationTermsApi(false);

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

  const fetchTerms = () => {
    if (education?.id) {
      educationTermsApi
        .getEducationTerms({ churchId, educationId: education.id })
        .then((response) => {
          const newTerms = response.data;
          setTerms(newTerms);
        });
    }
  };

  // 기수들 불러오기
  useEffect(() => {
    fetchTerms();
  }, [education]);

  const props = {
    education,
    terms,
    isModalShown,
    fetchTerms,
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
