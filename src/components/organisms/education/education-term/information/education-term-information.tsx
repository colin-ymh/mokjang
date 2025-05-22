import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { EducationTermsApi } from '@/api/education/education-terms.api';
import { useState } from 'react';
import {
  EDUCATION_TERM_STATUS,
  EducationEnrollment,
} from '@/models/education/education';
import { setTargetEducationTerm } from '@/redux/reducers/target-education-term-reducer';
import { setEducationTerms } from '@/redux/reducers/education-term-filter-reducer';
import EducationTermInformationView from '@/components/organisms/education/education-term/information/education-term-information.view';
import { EDUCATION_STATUS } from '@/constants/constant';
import { EducationEnrollmentsApi } from '@/api/education/education-enrollments.api';

type EducationTermInformationProps = {};

const EducationTermInformation = ({}: EducationTermInformationProps) => {
  const { educationTerms } = useSelector(
    (state: RootState) => state.educationTermFilter
  );
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const { churchId } = useSelector((state: RootState) => state.church);

  const dispatch = useDispatch<AppDispatch>();
  const educationTermsApi = new EducationTermsApi(false);
  const educationEnrollmentsApi = new EducationEnrollmentsApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // ===== status =====

  const onChangeStatus = (status: EDUCATION_TERM_STATUS) => {
    try {
      educationTermsApi
        .editEducationTerm(
          {
            churchId,
            educationId: targetEducation.id,
            educationTermId: targetEducationTerm.id,
          },
          { status: status }
        )
        .then((response) => {
          const newEducationTerm = response.data;

          dispatch(
            setTargetEducationTerm({
              ...targetEducationTerm,
              status: status,
            })
          );

          const newEducationTerms = educationTerms.map((v) => {
            return v.id !== newEducationTerm.id ? v : { ...v, status: status };
          });

          dispatch(setEducationTerms(newEducationTerms));
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  // ===== status =====

  // 수강 교인 상태 변경
  const onChangeEnrollmentStatus = (
    value: EDUCATION_STATUS,
    enrollment: EducationEnrollment
  ) => {
    try {
      educationEnrollmentsApi
        .editEducationEnrollment(
          {
            churchId,
            educationId: targetEducation.id,
            educationTermId: targetEducationTerm.id,
            educationEnrollmentId: enrollment.id,
          },
          { status: value }
        )
        .then((response) => {
          const newEducationEnrollment = response.data;

          const newEducationEnrollments =
            targetEducationTerm.educationEnrollments.map((enrollment) => {
              if (enrollment.id === newEducationEnrollment.id) {
                return newEducationEnrollment;
              } else {
                return enrollment;
              }
            });

          const newEducationTerm = {
            ...targetEducationTerm,
            educationEnrollments: newEducationEnrollments,
          };

          dispatch(setTargetEducationTerm(newEducationTerm));

          const newEducationTerms = educationTerms.map((v) => {
            return v.id !== targetEducationTerm.id ? v : newEducationTerm;
          });

          dispatch(setEducationTerms(newEducationTerms));
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const props = {
    onChangeStatus,
    onChangeEnrollmentStatus,
  };
  return (
    <>
      <EducationTermInformationView {...props} />
    </>
  );
};

export default EducationTermInformation;
