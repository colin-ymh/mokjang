import MainEducationHeaderView from './main-education-header.view';
import { getIsWellFormedTitle, usePageRouter } from '@mokjang/utils';
import { useEffect, useState } from 'react';
import { EducationsApi } from '../../../../../../api/education/educations.api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../../redux/store';
import { setEducations } from '../../../../../../redux/reducers/filter/education-filter-reducer';
import { setTargetEducation } from '../../../../../../redux/reducers/target/target-education-reducer';
import { DEFAULT_EDUCATION } from '@mokjang/models';
import {
  setIsToastShown,
  setToastText,
} from '../../../../../../redux/reducers/toast-popup-reducer';
import { useScopedI18n } from '../../../../../../../locales/client';

type MainEducationHeaderProps = {};

const MainEducationHeader = ({}: MainEducationHeaderProps) => {
  const router = usePageRouter();
  const dispatch = useDispatch<AppDispatch>();

  const t_popup = useScopedI18n('popup');

  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const { educations } = useSelector(
    (state: RootState) => state.educationFilter
  );

  const educationsApi = new EducationsApi(false);

  const [isAddEducationOpened, setIsAddEducationOpened] =
    useState<boolean>(false);

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`/main/education/${id}`);
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
            goals: targetEducation.goals,
          }
        )
        .then((response) => {
          const newEducation = response.data.data;

          dispatch(setEducations([...educations, newEducation]));
          dispatch(setTargetEducation(DEFAULT_EDUCATION));
          setIsAddEducationOpened(false);
          dispatch(setToastText(t_popup('saveComplete')));
          dispatch(setIsToastShown(true));
        });
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
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

  const props = {
    isAddEducationOpened,
    isSaveEnabled,
    onClickHeaderBar,
    onClickAddEducation,
    onClickCloseModal,
    onClickSaveEducation,
  };

  return (
    <>
      <MainEducationHeaderView {...props} />
    </>
  );
};
export default MainEducationHeader;
