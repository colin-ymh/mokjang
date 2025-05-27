import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  setEducationOrderBy,
  setEducationOrderDirection,
  setEducations,
} from '@/redux/reducers/filter/education-filter-reducer';

import EducationTableView from '@/components/molecules/education/education/education-table.view';
import { ORDER_DIRECTION } from '@/constants/constant';
import { EducationsApi } from '@/api/education/educations.api';
import { DEFAULT_EDUCATION, Education } from '@/models/education/education';
import { setTargetEducation } from '@/redux/reducers/target/target-education-reducer';
import { getIsWellFormedTitle } from '@/utils/check';
import { usePageRouter } from '@/utils/router';
import { EducationTermsApi } from '@/api/education/education-terms.api';

import { EDUCATION } from '@/constants/education/education-column';

export type EducationTableProps = {
  loadEducations: () => Promise<void>;
};

const EducationTable = ({ loadEducations }: EducationTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { churchId } = useSelector((state: RootState) => state.church);
  const {
    educations,
    educationFilter,
    educationOrderBy,
    educationOrderDirection,
  } = useSelector((state: RootState) => state.educationFilter);
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );

  const educationsApi = new EducationsApi(false);
  const educationTermsApi = new EducationTermsApi(false);
  const router = usePageRouter();

  const [isEditModalOpened, setIsEditModalOpened] = useState<boolean>(false);
  const [isDeleteModalOpened, setIsDeleteModalOpened] =
    useState<boolean>(false);

  const [isEditEnabled, setIsEditEnabled] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickEducationItem = (education: Education) => {
    dispatch(setTargetEducation(education));
    router.push(`/main/education/term`);
  };

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: EDUCATION) => {
    let newOrderBy = id;

    if (newOrderBy !== educationOrderBy) {
      dispatch(setEducationOrderBy(newOrderBy));
      dispatch(setEducationOrderDirection(ORDER_DIRECTION.ASC));
    } else {
      dispatch(
        setEducationOrderDirection(
          educationOrderDirection === ORDER_DIRECTION.ASC
            ? ORDER_DIRECTION.DESC
            : ORDER_DIRECTION.ASC
        )
      );
    }
  };

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

  const onClickDeleteEducation = () => {
    setIsDeleteModalOpened(true);
  };

  const onClickEditEducation = (education: Education) => {
    setIsEditModalOpened(true);
    dispatch(setTargetEducation(education));
  };

  const onClickCancelDelete = () => {
    setIsDeleteModalOpened(false);
  };

  const onClickConfirmDelete = (educationId: string) => {
    try {
      educationsApi.deleteEducation({ churchId, educationId });

      const newEducations = educations.filter(
        (education) => education.id !== educationId
      );

      dispatch(setEducations(newEducations));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onClickEditDone = () => {
    try {
      educationsApi
        .editEducation(
          { churchId, educationId: targetEducation.id },
          {
            name: targetEducation.name,
            description: targetEducation.description,
          }
        )
        .then((response) => {
          const newEducation = response.data;

          const newEducations = educations.map((education: Education) => {
            if (education.id !== newEducation.id) {
              return newEducation;
            } else {
              return education;
            }
          });

          dispatch(setEducations(newEducations));
          dispatch(setTargetEducation(DEFAULT_EDUCATION));
          setIsEditModalOpened(false);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 수정 페이지 종료
  const onClickEditClose = () => {
    setIsEditModalOpened(false);
    dispatch(setTargetEducation(DEFAULT_EDUCATION));
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [educationOrderBy, educationOrderDirection, educationFilter]);

  useEffect(() => {
    if (!getIsWellFormedTitle(targetEducation.name)) {
      setIsEditEnabled(false);
      return;
    }

    setIsEditEnabled(true);
  }, [targetEducation]);

  const props = {
    isEditModalOpened,
    isDeleteModalOpened,
    isEditEnabled,
    educations,
    scrollRef,
    onClickHeader,
    onScroll,
    onClickDeleteEducation,
    onClickEditEducation,
    onClickCancelDelete,
    onClickConfirmDelete,
    onClickEditDone,
    onClickEditClose,
    onClickEducationItem,
  };

  return (
    <>
      <EducationTableView {...props} />
    </>
  );
};

export default EducationTable;
