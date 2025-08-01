import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchEducations,
  setEducationPage,
} from '@/redux/reducers/filter/education-filter-reducer';
import EducationListView from '@/components/organisms/education/education/list/education-list.view';

type EducationListProps = {
  isNewEducation?: boolean;
};

const EducationList = ({ isNewEducation }: EducationListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    educationPage,
    educationFilter,
    educationOrderBy,
    educationOrderDirection,
  } = useSelector((state: RootState) => state.educationFilter);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 무한 스크롤로 데이터 추가 로드
  const loadEducations = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await dispatch(setEducationPage(educationPage + 1));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 정보가 변경될 때, 교인들을 다시 불러오는 부분
  useEffect(() => {
    const fetchInitialEducations = async () => {
      try {
        await dispatch(setEducationPage(1));
        await dispatch(fetchEducations());
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };
    fetchInitialEducations();
  }, [
    educationFilter,
    educationOrderBy,
    educationOrderDirection,
    isNewEducation,
  ]);

  useEffect(() => {
    dispatch(fetchEducations());
  }, [educationPage]);

  const props = {
    isLoading,
    loadEducations,
  };

  return (
    <>
      <EducationListView {...props} />
    </>
  );
};

export default EducationList;
