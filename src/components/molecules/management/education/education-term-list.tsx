import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { Education, EducationTerm } from '@/models/management/management';
import EducationTermListView from '@/components/molecules/management/education/education-term-list.view';
import { EducationTermsApi } from '@/api/management/education/education-terms.api';
import { useScopedI18n } from '../../../../../locales/client';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';

type EducationTermProps = {
  education: Education;
};

const EducationTermList = ({ education }: EducationTermProps) => {
  const t_popup = useScopedI18n('popup');
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const educationTermsApi = new EducationTermsApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const [isToastShown, setIsToastShown] = useState<boolean>(false);

  // 기수 목록
  const [terms, setTerms] = useState<EducationTerm[]>([]);

  // 기수 추가를 위한 모달 활성화 여부
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  // 기수 추가 모달 열기
  const onClickItem = () => {
    setIsModalShown(true);
  };

  // 기수 추가 모달 닫기
  const onClickModalClose = () => {
    setIsModalShown(false);
  };

  // 기수들 불러오기
  const fetchTerms = async () => {
    if (education?.id) {
      try {
        const response = await educationTermsApi.getEducationTerms({
          churchId,
          educationId: education.id,
        });

        const newTerms = response.data.data;
        setTerms(newTerms);
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }
  };

  // 기수들 불러오기 (education 변경 시 실행)
  useEffect(() => {
    fetchTerms();
  }, [education]);

  const props = {
    education,
    terms,
    isModalShown,
    fetchTerms,
    onClickItem,
    onClickModalClose,
    setIsToastShown,
  };

  return (
    <>
      <EducationTermListView {...props} />
      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={t_popup('saveComplete')}
        />
      )}
    </>
  );
};

export default EducationTermList;
