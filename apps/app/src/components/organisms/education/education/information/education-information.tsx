import React, { RefObject, useEffect, useState } from 'react';
import EducationInformationView from './education-information.view';
import { setTargetEducationTerm } from '../../../../../redux/reducers/target/target-education-term-reducer';
import { setEducations } from '../../../../../redux/reducers/filter/education-filter-reducer';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getIsWellFormedTitle,
} from '@mokjang/utils';
import {
  setIsToastShown,
  setToastText,
} from '../../../../../redux/reducers/toast-popup-reducer';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { EducationTermsApi } from '../../../../../api/education/education-terms.api';
import WrappedPagePopup from '../../../../atoms/common/popup/wrapped-page-popup';
import { MAIN } from '@mokjang/constants';
import AddEducationTerm from '../../education-term/add/add-education-term';
import { DEFAULT_EDUCATION_TERM, EducationTerm } from '@mokjang/models';
import { setTargetEducation } from '../../../../../redux/reducers/target/target-education-reducer';

type EducationInformationProps = {
  scrollRef: RefObject<HTMLDivElement>;
};

const EducationInformation = ({ scrollRef }: EducationInformationProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const t_title = useScopedI18n('title');

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

  // ---- infinite scroll guard states ----
  const TAKE = 10; // 한번에 가져올 개수(무한스크롤 페이지 사이즈)
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

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
        educationTerms: targetEducation?.educationTerms
          ? [newEducationTerm, ...targetEducation.educationTerms]
          : [newEducationTerm],
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

  const fetchEducationTerms = async () => {
    // 이미 로딩 중이거나 더 불러올 데이터가 없다면 중단
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const response = await educationTermsApi.getEducationTerms({
        churchId,
        educationId: targetEducation.id,
        page,
        take: TAKE,
      });

      const newTerms: EducationTerm[] = response.data.data;

      // 불러온 데이터가 없으면 더 이상 페이지가 없다고 판단
      if (!newTerms || newTerms.length === 0) {
        setHasMore(false);
        return;
      }

      const existingTerms = targetEducation.educationTerms || [];

      // 중복 ID 제거
      const existingIds = new Set(existingTerms.map((e) => e.id));
      const filteredNewTerms = newTerms.filter((e) => !existingIds.has(e.id));

      if (filteredNewTerms.length === 0) {
        // 가져온 데이터가 모두 중복이면, 더 이상 가져올 게 없다고 판단
        setHasMore(false);
        return;
      }

      dispatch(
        setTargetEducation({
          ...targetEducation,
          educationTerms: [...existingTerms, ...filteredNewTerms],
        })
      );

      // 이번 페이지에서 TAKE보다 적게 가져왔으면 다음 페이지는 없음
      if (filteredNewTerms.length < TAKE) {
        setHasMore(false);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const threshold = 16; // px
    const onScroll = () => {
      // 스크롤이 최하단에 도달했는지 확인
      if (isLoading || !hasMore) return;

      // 스크롤 가능한 상태(내용 높이가 컨테이너보다 큰가)
      const isScrollable = el.scrollHeight > el.clientHeight + 1;
      if (!isScrollable) return;

      if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
        setPage((prev) => prev + 1);
      }
    };

    el.addEventListener('scroll', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
    };
  }, [scrollRef, isLoading, hasMore]);

  useEffect(() => {
    fetchEducationTerms();
  }, [page]);

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
        widthPercentage={45}
        blur={false}
      >
        <AddEducationTerm />
      </WrappedPagePopup>
    </>
  );
};

export default EducationInformation;
