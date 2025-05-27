import MainEducationHeaderView from '@/components/molecules/layout/header/main/education/main-education-header.view';
import { usePageRouter } from '@/utils/router';
import { useEffect, useState } from 'react';
import { EducationsApi } from '@/api/education/educations.api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setEducations } from '@/redux/reducers/filter/education-filter-reducer';
import { getIsWellFormedTitle } from '@/utils/check';
import { setTargetEducation } from '@/redux/reducers/target/target-education-reducer';
import {
  DEFAULT_EDUCATION,
  DEFAULT_EDUCATION_TERM,
} from '@/models/education/education';
import { EducationTermsApi } from '@/api/education/education-terms.api';
import { setTargetEducationTerm } from '@/redux/reducers/target/target-education-term-reducer';
import { setEducationTerms } from '@/redux/reducers/filter/education-term-filter-reducer';
import { useParams } from 'next/navigation';
import { EDUCATION_CONTENT_ID } from '@/constants/layout/content';
import { EducationEnrollmentsApi } from '@/api/education/education-enrollments.api';

type MainEducationHeaderProps = {};

const MainEducationHeader = ({}: MainEducationHeaderProps) => {
  const slug = useParams().slug as string[];
  const contentId = slug[2];

  const isTerm = contentId === EDUCATION_CONTENT_ID.TERM;
  const router = usePageRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const { educations } = useSelector(
    (state: RootState) => state.educationFilter
  );
  const { educationTerms } = useSelector(
    (state: RootState) => state.educationTermFilter
  );

  const educationsApi = new EducationsApi(false);
  const educationTermsApi = new EducationTermsApi(false);
  const educationEnrollmentsApi = new EducationEnrollmentsApi(false);

  const [isAddEducationOpened, setIsAddEducationOpened] =
    useState<boolean>(false);

  const [isAddEducationTermOpened, setIsAddEducationTermOpened] =
    useState<boolean>(false);

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const [isTermSaveEnabled, setIsTermSaveEnabled] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`/main/education/${id}`);
  };

  // 기수 => 교육으로 돌아가기
  const onClickGoBack = () => {
    router.push(`/main/education/all`);
    dispatch(setTargetEducationTerm(DEFAULT_EDUCATION_TERM));
    dispatch(setTargetEducation(DEFAULT_EDUCATION));
    dispatch(setEducationTerms([]));
  };

  // ========== 교육 ==========
  const onClickAddEducation = () => {
    setIsAddEducationOpened(true);
  };

  const onClickCloseModal = () => {
    setIsAddEducationOpened(false);
    dispatch(setTargetEducation(DEFAULT_EDUCATION));
  };

  const onClickSaveEducation = async () => {
    try {
      await educationsApi
        .createEducation(
          { churchId },
          {
            name: targetEducation.name,
            description: targetEducation.description,
          }
        )
        .then((response) => {
          const newEducation = response.data;

          dispatch(setEducations([...educations, newEducation]));
          dispatch(setTargetEducation(DEFAULT_EDUCATION));
          setIsAddEducationOpened(false);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    if (!getIsWellFormedTitle(targetEducation.name)) {
      setIsSaveEnabled(false);
      return;
    }

    setIsSaveEnabled(true);
  }, [targetEducation]);
  // ========== 교육 ==========

  // ========== 기수 ==========
  const onClickAddEducationTerm = () => {
    let nextTerm = 1;
    educationTerms.forEach((term) => {
      if (parseInt(term.term) > nextTerm) {
        nextTerm = parseInt(term.term) + 1;
      }
    });

    setIsAddEducationTermOpened(true);
    dispatch(
      setTargetEducationTerm({
        ...DEFAULT_EDUCATION_TERM,
        id: 'TEMP',
        term: nextTerm.toString(),
      })
    );
  };

  const onClickCloseTermModal = () => {
    setIsAddEducationTermOpened(false);
    dispatch(setTargetEducationTerm(DEFAULT_EDUCATION_TERM));
  };

  const onClickSaveEducationTerm = async () => {
    try {
      await educationTermsApi
        .createEducationTerm(
          { churchId, educationId: targetEducation.id },
          {
            term: targetEducationTerm.term,
            startDate: targetEducationTerm.startDate,
            endDate: targetEducationTerm.endDate,
            inChargeId: targetEducationTerm.inChargeId,
            content: targetEducationTerm.content,
          }
        )
        .then((response) => {
          const newEducationTerm = response.data.data;

          // 저장할 수강 교인이 있는 경우
          if (targetEducationTerm.educationEnrollments.length > 0) {
            targetEducationTerm.educationEnrollments.map((enrollment) => {
              educationEnrollmentsApi.createEducationEnrollments(
                {
                  churchId,
                  educationId: newEducationTerm.educationId,
                  educationTermId: newEducationTerm.id,
                },
                {
                  memberId: enrollment.memberId,
                  status: enrollment.status,
                }
              );
            });
          }

          const newEducationTerms = [...educationTerms, newEducationTerm];

          dispatch(setEducationTerms(newEducationTerms));
          dispatch(setTargetEducationTerm(DEFAULT_EDUCATION_TERM));
          setIsAddEducationTermOpened(false);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    if (getIsWellFormedTitle(targetEducation.name)) {
      setIsTermSaveEnabled(false);
      return;
    }

    setIsTermSaveEnabled(true);
  }, [targetEducation]);

  useEffect(() => {
    if (!targetEducationTerm.term) {
      setIsTermSaveEnabled(false);
      return;
    }
    if (!targetEducationTerm.startDate || !targetEducationTerm.endDate) {
      setIsTermSaveEnabled(false);
      return;
    }
    if (!targetEducationTerm.inChargeId) {
      setIsTermSaveEnabled(false);
      return;
    }

    setIsTermSaveEnabled(true);
  }, [targetEducationTerm]);

  // ========== 기수 ==========

  // 선택된 교육이 없으면 교육 화면으로 이동
  useEffect(() => {
    if (isTerm && !targetEducation.id) {
      router.push(`/main/education/all`);
      dispatch(setTargetEducationTerm(DEFAULT_EDUCATION_TERM));
      dispatch(setTargetEducation(DEFAULT_EDUCATION));
      dispatch(setEducationTerms([]));
    }
  }, [targetEducation.id]);

  const props = {
    isAddEducationOpened,
    isAddEducationTermOpened,
    isSaveEnabled,
    isTermSaveEnabled,
    onClickHeaderBar,
    onClickAddEducation,
    onClickCloseModal,
    onClickSaveEducation,
    onClickAddEducationTerm,
    onClickCloseTermModal,
    onClickSaveEducationTerm,
    onClickGoBack,
  };

  return (
    <>
      <MainEducationHeaderView {...props} />
    </>
  );
};
export default MainEducationHeader;
