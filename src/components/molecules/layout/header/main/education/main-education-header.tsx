import MainEducationHeaderView from '@/components/molecules/layout/header/main/education/main-education-header.view';
import { usePageRouter } from '@/utils/router';
import { useEffect, useState } from 'react';
import { EducationsApi } from '@/api/education/educations.api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setEducations } from '@/redux/reducers/education-filter-reducer';
import { getIsWellFormedTitle } from '@/utils/check';
import { setTargetEducation } from '@/redux/reducers/target-education-reducer';
import { DEFAULT_EDUCATION } from '@/models/education/education';
import { EducationTermsApi } from '@/api/education/education-terms.api';

type MainEducationHeaderProps = {};

const MainEducationHeader = ({}: MainEducationHeaderProps) => {
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

  const educationsApi = new EducationsApi(false);
  const educationTermsApi = new EducationTermsApi(false);

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
    router.push(`admin/main/education/${id}`);
  };

  // 기수 => 교육으로 돌아가기
  const onClickGoBack = () => {
    router.push(`admin/main/education/all`);
  };

  // ========== 교육 ==========
  const onClickAddEducation = () => {
    setIsAddEducationOpened(true);
  };

  const onClickCloseModal = () => {
    setIsAddEducationOpened(false);
  };

  const onClickSaveEducation = () => {
    try {
      educationsApi
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
    setIsAddEducationTermOpened(true);
  };

  const onClickCloseTermModal = () => {
    setIsAddEducationTermOpened(false);
  };

  const onClickSaveEducationTerm = () => {
    try {
      educationTermsApi
        .createEducationTerm(
          { churchId, educationId: targetEducation.id },
          {
            term: targetEducationTerm.term,
            numberOfSessions: '10',
            startDate: targetEducationTerm.startDate,
            endDate: targetEducationTerm.endDate,
          }
        )
        .then((response) => {
          // const newEducation = response.data;
          //
          // dispatch(setEducations([...educations, newEducation]));
          // dispatch(setTargetEducation(DEFAULT_EDUCATION));
          setIsAddEducationTermOpened(false);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    setIsTermSaveEnabled(true);
  }, [targetEducationTerm]);

  // ========== 기수 ==========

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
