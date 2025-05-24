import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { getTrimmedString } from '@/utils/format';
import { BLANK } from '@/constants/constant';
import { setEducationTermFilter } from '@/redux/reducers/education-term-filter-reducer';
import { EDUCATION_TERM } from '@/constants/education/education-column';
import { EducationTermFilteredItemType } from '@/components/atoms/education/education-term/education-term-filtered-item';
import EducationTermRowView, {
  EDUCATION_TERM_SEARCH_FILTER,
} from '@/components/molecules/education/education-term/education-term-row.view';

const EducationTermRow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { educationTermFilter } = useSelector(
    (state: RootState) => state.educationTermFilter
  );
  // 기간 설정  모달 on off
  const [isModalShown, setIsAddFilterShown] = useState<boolean>(false);

  // 목록 설정 모달 열기
  const onClickPeriodModal = () => {
    setIsAddFilterShown(!isModalShown);
  };

  // 목록 설정 닫기
  const onClickClosePeriodModal = () => {
    setIsAddFilterShown(false);
  };

  // 기간 저장
  const onClickSavePeriod = (startDate: string, endDate: string) => {
    // dispatch(
    //   setEducationTermFilter({
    //     ...educationTermFilter,
    //     [EDUCATION_TERM.FROM_DATE]: startDate,
    //     [EDUCATION_TERM.TO_DATE]: endDate,
    //   })
    // );
    setIsAddFilterShown(false);
  };

  // 검색 필터 주제
  const [searchFilter, setSearchFilter] =
    useState<EDUCATION_TERM_SEARCH_FILTER>(EDUCATION_TERM.EDUCATION);
  // 검색 내용 ref
  const searchRef = useRef<HTMLInputElement>(null);
  // 검색 필터 내용
  const [searchValue, setSearchValue] = useState<string>(BLANK);

  // 필터 내용 태그
  const [filteredItems, setFilteredItems] = useState<
    EducationTermFilteredItemType[]
  >([]);

  // 검색 주제 선택
  const onClickSearchFilterItem = (value: EDUCATION_TERM_SEARCH_FILTER) => {
    setSearchFilter(value);
  };

  // 검색 내용 변경
  const onChangeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = getTrimmedString(event.target.value);
    setSearchValue(newValue);
  };

  // 검색 버튼
  const onClickSearch = () => {
    dispatch(
      setEducationTermFilter({
        ...educationTermFilter,
        [searchFilter]: searchValue,
      })
    );
  };

  // 검색 중 엔터
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchRef.current === document.activeElement) {
      onClickSearch();
    }
  };

  // 필터된 내용들을 태그 형식으로 변환
  useEffect(() => {
    let newFilterItems: EducationTermFilteredItemType[] = [];

    // // 상태
    // if (educationTermFilter.educationTermStatus.length > 0) {
    //   newFilterItems.push({
    //     title: EDUCATION_TERM.STATUS,
    //     value: educationTermFilter.educationTermStatus,
    //   });
    // }

    // 일자
    // if (
    //   educationTermFilter.fromEducationTermDate ||
    //   educationTermFilter.toEducationTermDate
    // ) {
    //   newFilterItems.push({
    //     title: EDUCATION_TERM.DATE,
    //     value: [
    //       educationTermFilter.fromEducationTermDate,
    //       educationTermFilter.toEducationTermDate,
    //     ],
    //   });
    // }

    // 이름
    if (educationTermFilter.education) {
      newFilterItems.push({
        title: EDUCATION_TERM.EDUCATION,
        value: [educationTermFilter.education],
      });
    }

    setFilteredItems(newFilterItems);
  }, [educationTermFilter]);

  useEffect(() => {}, []);

  const props = {
    isModalShown,
    searchFilter,
    searchValue,
    searchRef,
    filteredItems,
    onClickPeriodModal,
    onClickSearchFilterItem,
    onChangeSearchValue,
    onClickSearch,
    onKeyDown,
    onClickClosePeriodModal,
    onClickSavePeriod,
  };

  return (
    <>
      <EducationTermRowView {...props} />
    </>
  );
};

export default EducationTermRow;
