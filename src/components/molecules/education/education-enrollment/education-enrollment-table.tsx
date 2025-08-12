import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { EDUCATION_ENROLLMENT_STATUS } from '@/constants/status/status';
import { EducationEnrollmentsApi } from '@/api/education/education-enrollments.api';
import { setTargetEducationTerm } from '@/redux/reducers/target/target-education-term-reducer';
import { CustomError } from '@/api/error/error';
import EducationEnrollmentTableView from '@/components/molecules/education/education-enrollment/education-enrollment-table.view';

export type EducationEnrollmentTableProps = {};

const EducationEnrollmentTable = ({}: EducationEnrollmentTableProps) => {
  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const dispatch = useDispatch<AppDispatch>();

  const educationEnrollmentsApi = new EducationEnrollmentsApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onChangeStatus = async (
    enrollmentId: string,
    status: EDUCATION_ENROLLMENT_STATUS
  ) => {
    try {
      const newEducationTerm = {
        ...targetEducationTerm,
        educationEnrollments: targetEducationTerm.educationEnrollments.map(
          (enrollment) => {
            if (enrollment.id === enrollmentId) {
              return { ...enrollment, status };
            } else {
              return enrollment;
            }
          }
        ),
      };

      dispatch(setTargetEducationTerm(newEducationTerm));

      educationEnrollmentsApi.editEducationEnrollment(
        {
          churchId,
          educationId: targetEducationTerm.educationId,
          educationTermId: targetEducationTerm.id,
          educationEnrollmentId: enrollmentId,
        },
        {
          status,
        }
      );
    } catch (error) {
      setThrownError(error as CustomError);
    }
  };

  const props = {
    onChangeStatus,
  };

  return (
    <>
      <EducationEnrollmentTableView {...props} />
    </>
  );
};

export default EducationEnrollmentTable;
