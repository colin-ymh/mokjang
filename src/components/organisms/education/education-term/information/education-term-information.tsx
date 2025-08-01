import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { EducationTermsApi } from '@/api/education/education-terms.api';
import { useState } from 'react';
import { EducationEnrollment } from '@/models/education/education';
import { setTargetEducationTerm } from '@/redux/reducers/target/target-education-term-reducer';
import { setEducationTerms } from '@/redux/reducers/filter/education-term-filter-reducer';
import EducationTermInformationView from '@/components/organisms/education/education-term/information/education-term-information.view';
import { EducationEnrollmentsApi } from '@/api/education/education-enrollments.api';

import {
  EDUCATION_ENROLLMENT_STATUS,
  EDUCATION_TERM_STATUS,
} from '@/constants/status/status';
import { EDUCATION_TERM_CONTENT_ID } from '@/constants/layout/content';
import { Member } from '@/models/member/member';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { BLACK, DESTRUCTIVE } from '@/constants/styles/color';
import { useScopedI18n } from '../../../../../../locales/client';

type EducationTermInformationProps = {};

const EducationTermInformation = ({}: EducationTermInformationProps) => {
  const t_popup = useScopedI18n('popup');
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

  const [headerBar, setHeaderBar] = useState<EDUCATION_TERM_CONTENT_ID>(
    EDUCATION_TERM_CONTENT_ID.SESSIONS
  );

  // 선택된 교인 목록
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  // 그룹에 교인 다중 추가를 위한 모달 활성화 여부
  const [isAddModalShown, setIsAddModalShown] = useState<boolean>(false);

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
          const newEducationTerm = response.data.data;

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
    value: EDUCATION_ENROLLMENT_STATUS,
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
          const newEducationEnrollment = response.data.data;

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

  const onChangeHeaderBar = (headerBar: EDUCATION_TERM_CONTENT_ID) => {
    setHeaderBar(headerBar);
  };

  const onClickAddEnrollmentsOpen = () => setIsAddModalShown(true);

  const onClickAddEnrollmentsClose = () => {
    setIsAddModalShown(false);
    setSelectedMembers([]);
  };

  // 새로운 그룹원들 추가
  const onClickSaveNewEnrollments = async () => {
    try {
      if (selectedMembers.length === 0) return;

      await Promise.all(
        selectedMembers.map(async (m) => {
          await educationEnrollmentsApi.createEducationEnrollments(
            {
              churchId,
              educationId: targetEducationTerm.educationId,
              educationTermId: targetEducationTerm.id,
            },
            {
              memberId: m.id,
            }
          );
        })
      );

      const response = await educationEnrollmentsApi.getEducationEnrollments({
        churchId,
        educationId: targetEducationTerm.educationId,
        educationTermId: targetEducationTerm.id,
      });

      const newEducationEnrollments = response.data.data;

      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          educationEnrollments: newEducationEnrollments,
        })
      );

      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setToastBackgroundColor(BLACK));
      dispatch(setIsToastShown(true));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.LIGHT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      setTimeout(() => {
        setSelectedMembers([]);
        setIsAddModalShown(false);
      });
    }
  };

  const props = {
    isAddModalShown,
    headerBar,
    onChangeStatus,
    onChangeEnrollmentStatus,
    onChangeHeaderBar,
    onClickAddEnrollmentsOpen,
    onClickAddEnrollmentsClose,
    onClickSaveNewEnrollments,
    selectedMembers,
    setSelectedMembers,
  };
  return (
    <>
      <EducationTermInformationView {...props} />
    </>
  );
};

export default EducationTermInformation;
