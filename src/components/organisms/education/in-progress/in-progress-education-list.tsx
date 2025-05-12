import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchEducationTerms,
  setEducationTerms,
} from '@/redux/reducers/education-term-filter-reducer';
import { EducationTerm } from '@/models/education/education';
import InProgressEducationListView from '@/components/organisms/education/in-progress/in-progress-education-list.view';

type EducationListProps = {
  isNewEducation?: boolean;
};

const InProgressEducationList = ({ isNewEducation }: EducationListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const {
    educationTerms,
    educationTermFilter,
    educationTermOrderBy,
    educationTermOrderDirection,
  } = useSelector((state: RootState) => state.educationTermFilter);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 무한 스크롤로 데이터 추가 로드
  const loadEducations = async () => {
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchEducationTerms({ churchId, currentPage: page + 1 })
      );
      if (fetchEducationTerms.fulfilled.match(result)) {
        const newEducationTerms: EducationTerm[] = result.payload;
        if (newEducationTerms.length > 0) {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(
            educationTerms.map((educationTerm) => educationTerm.id)
          );
          const filteredNewEducations = newEducationTerms.filter(
            (educationTerm) => !existingIds.has(educationTerm.id)
          );
          dispatch(
            setEducationTerms([...educationTerms, ...filteredNewEducations])
          );
          setPage((prev) => prev + 1); // 다음 페이지로 이동
        }
      }
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
        const result = await dispatch(
          fetchEducationTerms({ churchId, currentPage: 1 })
        );
        if (fetchEducationTerms.fulfilled.match(result)) {
          dispatch(setEducationTerms(result.payload));
          setPage(1);
        }
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    fetchInitialEducations();
  }, [
    churchId,
    educationTermFilter,
    educationTermOrderBy,
    educationTermOrderDirection,
    isNewEducation,
  ]);

  const props = {
    list: {
      loadEducations,
    },
  };

  return (
    <>
      <InProgressEducationListView {...props} />
    </>
  );
};

export default InProgressEducationList;
