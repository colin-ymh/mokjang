import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchEducations,
  setEducationPage,
} from '@/redux/reducers/filter/education-filter-reducer';

import { setTargetEducation } from '@/redux/reducers/target/target-education-reducer';
import {
  setIsToastShown,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { getIsWellFormedTitle } from '@/utils/check';
import { useScopedI18n } from '../../../../../../locales/client';
import { EducationsApi } from '@/api/education/educations.api';
import { DEFAULT_EDUCATION } from '@/models/education/education';
import EducationListView from '@/components/organisms/education/education/list/education-list.view';

type EducationListProps = {
  isNewEducation?: boolean;
};

const EducationList = ({ isNewEducation }: EducationListProps) => {
  const educationApi = new EducationsApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const {
    educations,
    educationPage,
    educationFilter,
    educationOrderBy,
    educationOrderDirection,
  } = useSelector((state: RootState) => state.educationFilter);
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );

  const t_popup = useScopedI18n('popup');

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 교인 상세정보 팝업 On/Off
  const [isEducationInformationShown, setIsEducationInformationShown] =
    useState<boolean>(false);

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  // 개인정보 수정 모달
  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  // 무한 스크롤로 데이터 추가 로드
  const loadEducations = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await dispatch(setEducationPage(educationPage + 1));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 정보가 변경될 때, 교인들을 다시 불러오는 부분
  useEffect(() => {
    const fetchInitialEducations = async () => {
      try {
        await dispatch(setEducationPage(1));
        await dispatch(fetchEducations());
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };
    fetchInitialEducations();
  }, [
    educationFilter,
    educationOrderBy,
    educationOrderDirection,
    isNewEducation,
  ]);

  // 목록에서 교인을 선택하여 상세 페이지로 이동
  const onClickEducationItem = async (educationId: string) => {
    try {
      const response = await educationApi.getEducation({
        churchId,
        educationId,
      });
      const education = response.data.data;

      dispatch(setTargetEducation(education));
      dispatch(setTargetEducation(education));
      setIsEducationInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickClose = () => {
    setIsEducationInformationShown(false);
    dispatch(setTargetEducation(DEFAULT_EDUCATION));
  };

  // 교인 삭제하기
  const onClickDelete = async () => {
    try {
      await educationApi.deleteEducation({
        churchId,
        educationId: targetEducation.id,
      });

      // 초기화 후 다시 로드
      dispatch(setEducationPage(1));
      // 삭제 후 재로딩
      await dispatch(fetchEducations());
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetEducation(DEFAULT_EDUCATION));
      setIsEducationInformationShown(false);
    }
  };

  const onClickEditOpen = () => {
    dispatch(setTargetEducation(targetEducation));
    setIsEditShown(true);
  };

  const onClickEditClose = async () => {
    const educationApi = new EducationsApi(false);
    setIsEditShown(false);
    const response = await educationApi.getEducation({
      churchId,
      educationId: targetEducation.id,
    });
    const newEducation = response.data.data;
    dispatch(setTargetEducation(newEducation));
  };

  const onClickEditDone = async () => {
    try {
      await educationApi
        .editEducation(
          { churchId, educationId: targetEducation.id },
          {
            name: targetEducation.name || undefined,
            description: targetEducation.description || undefined,
          }
        )
        .then((response) => {
          const newEducation = response.data.data;
          dispatch(setTargetEducation(newEducation));
          dispatch(fetchEducations());
          setIsEditShown(false);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setIsToastShown(true));
      dispatch(setToastText(t_popup('saveComplete')));
    }
  };

  useEffect(() => {
    setIsPopupShown(false);
  }, [targetEducation]);

  useEffect(() => {
    dispatch(fetchEducations());
  }, [educationPage]);

  useEffect(() => {
    if (!getIsWellFormedTitle(targetEducation.name)) {
      setIsSaveEnabled(false);
      return;
    }

    setIsSaveEnabled(true);
  }, [targetEducation]);

  const props = {
    list: {
      educations,
      onClickEducationItem,
      loadEducations,
    },
    information: {
      isSaveEnabled,
      isEducationInformationShown,
      isLoading,
      isPopupShown,
      isEditShown,
      onClickEditOpen,
      onClickEditClose,
      onClickEditDone,
      onClickClose,
      onClickDelete,
      onClickConfirmOpen,
      onClickConfirmClose,
    },
  };

  return (
    <>
      <EducationListView {...props} />
    </>
  );
};

export default EducationList;
