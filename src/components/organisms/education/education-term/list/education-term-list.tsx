import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchEducationTerms,
  setEducationTerms,
} from '@/redux/reducers/education-term-filter-reducer';

import { EducationTermsApi } from '@/api/education/education-terms.api';

import { setTargetEducationTerm } from '@/redux/reducers/target-education-term-reducer';
import {
  DEFAULT_EDUCATION_TERM,
  EducationTerm,
} from '@/models/education/education';
import EducationTermListView from '@/components/organisms/education/education-term/list/education-term-list.view';

type EducationTermListProps = {
  isNewEducationTerm?: boolean;
};

const EducationTermList = ({ isNewEducationTerm }: EducationTermListProps) => {
  const educationTermsApi = new EducationTermsApi(false);
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
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 상세정보 팝업 On/Off
  const [isEducationTermInformationShown, setIsEducationTermInformationShown] =
    useState<boolean>(false);

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
  const loadEducationTerms = async () => {
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
          const filteredNewEducationTerms = newEducationTerms.filter(
            (educationTerm) => !existingIds.has(educationTerm.id)
          );
          dispatch(
            setEducationTerms([...educationTerms, ...filteredNewEducationTerms])
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
    const fetchInitialEducationTerms = async () => {
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

    fetchInitialEducationTerms();
  }, [
    churchId,
    educationTermFilter,
    educationTermOrderBy,
    educationTermOrderDirection,
    isNewEducationTerm,
  ]);

  const onClickEditDone = async () => {
    try {
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 목록에서 교인을 선택하여 상세 페이지로 이동
  const onClickEducationTermItem = async (educationTermId: string) => {
    try {
      const response = await educationTermsApi.getEducationTerm({
        churchId,
        educationId: targetEducation.id,
        educationTermId,
      });
      const educationTerm = response.data;

      dispatch(setTargetEducationTerm(educationTerm));
      setIsEducationTermInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickClose = () => {
    setIsEducationTermInformationShown(false);
    dispatch(setTargetEducationTerm(DEFAULT_EDUCATION_TERM));
  };

  // 교인 삭제하기
  const onClickDelete = async () => {
    try {
      const response = await educationTermsApi.deleteEducationTerm({
        churchId,
        educationId: targetEducation.id,
        educationTermId: targetEducationTerm.id,
      });

      if (response.status === 200) {
        // 초기화 후 다시 로드
        setPage(1);
        const result = await dispatch(
          fetchEducationTerms({ churchId, currentPage: 1 })
        );
        if (fetchEducationTerms.fulfilled.match(result)) {
          dispatch(setEducationTerms(result.payload));
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetEducationTerm(DEFAULT_EDUCATION_TERM));
      setIsEducationTermInformationShown(false);
    }
  };

  // 수정 페이지 종료
  const onClickEditClose = () => {
    setIsEditShown(false);
    setTimeout(() => {
      setIsEducationTermInformationShown(true);
    }, 500);
  };

  // 수정 페이지 열기
  const onClickEditOpen = () => {
    setIsEducationTermInformationShown(false);
    setTimeout(() => {
      setIsEditShown(true);
    }, 500);
  };

  useEffect(() => {
    setIsPopupShown(false);
  }, [targetEducationTerm]);

  const props = {
    list: {
      onClickEducationTermItem,
      loadEducationTerms,
    },
    information: {
      isEducationTermInformationShown,
      isEditShown,
      isLoading,
      isPopupShown,
      onClickClose,
      onClickDelete,
      onClickConfirmOpen,
      onClickConfirmClose,
      onClickEditDone,
      onClickEditOpen,
      onClickEditClose,
    },
  };

  return (
    <>
      <EducationTermListView {...props} />
    </>
  );
};

export default EducationTermList;
