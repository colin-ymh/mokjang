import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { EducationTerm } from '@/models/education/education';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { DESTRUCTIVE } from '@/constants/styles/color';
import { EducationSessionsApi } from '@/api/education/education-sessions.api';
import { EducationsApi } from '@/api/education/educations.api';
import EducationTermTableView from '@/components/molecules/education/education-term/education-term-table.view';
import { setTargetEducation } from '@/redux/reducers/target/target-education-reducer';

export type EducationTermTableProps = {};

const EducationTermTable = ({}: EducationTermTableProps) => {
  const educationApi = new EducationsApi(false);
  const { churchId } = useSelector((state: RootState) => state.church);
  const { educations } = useSelector(
    (state: RootState) => state.educationFilter
  );
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const dispatch = useDispatch<AppDispatch>();

  const educationSessionsApi = new EducationSessionsApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  // 열려있는 교육 기수 목록
  const [openedTermIds, setOpenedTermIds] = useState<string[]>([]);

  // 교육 기수 열고 닫기
  const onClickTermChevron = async (value: EducationTerm) => {
    try {
      if (openedTermIds.includes(value.id)) {
        setOpenedTermIds(openedTermIds.filter((id) => id !== value.id));
      } else {
        if (!value.educationSessions) {
          const response = await educationSessionsApi.getEducationSessions({
            churchId,
            educationId: value.educationId,
            educationTermId: value.id,
          });

          const newEducationSessions = response.data.data;

          const newEducation = {
            ...targetEducation,
            educationTerms: targetEducation.educationTerms?.map((term) => {
              if (term.id === value.id) {
                return {
                  ...term,
                  educationSessions: newEducationSessions,
                };
              } else {
                return term;
              }
            }),
          };

          dispatch(setTargetEducation(newEducation));
        }
        setOpenedTermIds([...openedTermIds, value.id]);
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.LIGHT));
        dispatch(setIsToastShown(true));
      } else setThrownError(new Error(String(error)));
    }
  };

  const props = {
    openedTermIds,
    onClickTermChevron,
  };

  return (
    <>
      <EducationTermTableView {...props} />
    </>
  );
};

export default EducationTermTable;
