import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchEducations,
  setEducations,
} from '@/redux/reducers/education-filter-reducer';

import { Education } from '@/models/education/education';
import { EducationsApi } from '@/api/education/educations.api';
import EducationListView from '@/components/organisms/education/education/list/education-list.view';

type EducationListProps = {
  isNewEducation?: boolean;
};

const EducationList = ({ isNewEducation }: EducationListProps) => {
  const educationsApi = new EducationsApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const {
    educations,
    educationFilter,
    educationOrderBy,
    educationOrderDirection,
  } = useSelector((state: RootState) => state.educationFilter);
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 수정 팝업 On/Off
  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  // 무한 스크롤로 데이터 추가 로드
  const loadEducations = async () => {
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchEducations({ churchId, currentPage: page + 1 })
      );
      if (fetchEducations.fulfilled.match(result)) {
        const newEducations: Education[] = result.payload;
        if (newEducations.length > 0) {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(
            educations.map((education) => education.id)
          );
          const filteredNewEducations = newEducations.filter(
            (education) => !existingIds.has(education.id)
          );
          dispatch(setEducations([...educations, ...filteredNewEducations]));
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
          fetchEducations({ churchId, currentPage: 1 })
        );
        if (fetchEducations.fulfilled.match(result)) {
          dispatch(setEducations(result.payload));
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
    educationFilter,
    educationOrderBy,
    educationOrderDirection,
    isNewEducation,
  ]);

  useEffect(() => {
    setIsPopupShown(false);
  }, [targetEducation]);

  const props = {
    list: {
      loadEducations,
    },
  };

  return (
    <>
      <EducationListView {...props} />
    </>
  );
};

export default EducationList;
