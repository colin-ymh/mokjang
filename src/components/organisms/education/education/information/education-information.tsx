import React, { useEffect, useRef, useState } from 'react';
import EducationInformationView from '@/components/organisms/education/education/information/education-information.view';
import { setTargetEducationTerm } from '@/redux/reducers/target/target-education-term-reducer';
import { setEducations } from '@/redux/reducers/filter/education-filter-reducer';
import { getDateFromDateString, getDateStringFromDate } from '@/utils/date';
import {
  setIsToastShown,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { getIsWellFormedTitle } from '@/utils/check';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { EducationTermsApi } from '@/api/education/education-terms.api';
import WrappedPagePopup from '@/components/atoms/common/popup/wrapped-page-popup';
import { MAIN } from '@/constants/styles/color';
import AddEducationTerm from '@/components/organisms/education/education-term/add/add-education-term';
import { DEFAULT_EDUCATION_TERM } from '@/models/education/education';
import { setTargetEducation } from '@/redux/reducers/target/target-education-reducer';

type EducationInformationProps = {};

const EducationInformation = ({}: EducationInformationProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const t_title = useScopedI18n('title');

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { churchId } = useSelector((state: RootState) => state.church);

  const { educations } = useSelector(
    (state: RootState) => state.educationFilter
  );
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );

  const educationTermsApi = new EducationTermsApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // ------------------------- 교육 기수 ---------------------------

  const [isEducationTermSaveEnabled, setIsEducationTermSaveEnabled] =
    useState<boolean>(false);

  //  수정 모달
  const [isEducationTermAddShown, setIsEducationTermAddShown] =
    useState<boolean>(false);

  const onClickAddEducationTermOpen = () => {
    dispatch(setTargetEducationTerm(targetEducationTerm));
    setIsEducationTermAddShown(true);
  };

  const onClickAddEducationTermClose = async () => {
    setIsEducationTermAddShown(false);
    dispatch(setTargetEducationTerm(DEFAULT_EDUCATION_TERM));
  };

  const onClickAddEducationTermDone = async () => {
    try {
      const response = await educationTermsApi.createEducationTerm(
        {
          churchId,
          educationId: targetEducation.id,
        },
        {
          term: targetEducationTerm.term,
          startDate: getDateStringFromDate(
            getDateFromDateString(targetEducationTerm.startDate)
          ),
          endDate: getDateStringFromDate(
            getDateFromDateString(targetEducationTerm.endDate)
          ),
          inChargeId: targetEducationTerm.inChargeId || undefined,
          location: targetEducationTerm.location || undefined,
          receiverIds: targetEducationTerm.receiverIds || [],
        }
      );

      const newEducationTerm = {
        ...response.data.data,
        educationSessions: targetEducationTerm.educationSessions,
        educationEnrollments: targetEducationTerm.educationEnrollments,
      };
      const newTargetEducation = {
        ...targetEducation,
        educationTerms: [newEducationTerm, ...targetEducation.educationTerms],
      };
      const newEducations = educations.map((education) => {
        if (education.id === targetEducationTerm.educationId) {
          return newTargetEducation;
        } else {
          return education;
        }
      });

      dispatch(setEducations(newEducations));
      dispatch(setTargetEducation(newTargetEducation));

      setIsEducationTermAddShown(false);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setIsToastShown(true));
      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setTargetEducationTerm(DEFAULT_EDUCATION_TERM));
    }
  };

  useEffect(() => {
    if (!getIsWellFormedTitle(targetEducationTerm.term)) {
      setIsEducationTermSaveEnabled(false);
      return;
    }

    if (!targetEducationTerm.inChargeId) {
      setIsEducationTermSaveEnabled(false);
      return;
    }

    setIsEducationTermSaveEnabled(true);
  }, [targetEducationTerm]);

  // ------------------------- 교육 기수 ---------------------------

  const props = {
    onClickAddEducationTermOpen,
  };

  return (
    <>
      <EducationInformationView {...props} />

      {/* 교육기수 추가 팝업*/}
      <WrappedPagePopup
        keyboardDisabled={true}
        isShow={isEducationTermAddShown}
        onClickClose={onClickAddEducationTermClose}
        onClickCancel={onClickAddEducationTermClose}
        onClickDone={onClickAddEducationTermDone}
        headerTitle={t_title('addEducationTerm')}
        doneBackgroundColor={
          isEducationTermSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT
        }
        doneDisabled={!isEducationTermSaveEnabled}
        closeText={t_button('backToEducation')}
      >
        <AddEducationTerm />
      </WrappedPagePopup>
    </>
  );
};

export default EducationInformation;
