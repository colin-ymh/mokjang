import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { getTrimmedString } from '@/utils/format';
import { EDUCATION } from '@/constants/education/education-column';
import { BLANK } from '@/constants/constant';
import EducationRowView, {
  EDUCATION_SEARCH_FILTER,
} from '@/components/molecules/education/education/education-row.view';
import { EducationFilteredItemType } from '@/components/atoms/education/education/education-filtered-item';
import { setEducationFilter } from '@/redux/reducers/education-filter-reducer';

const EducationRow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { educationFilter } = useSelector(
    (state: RootState) => state.educationFilter
  );

  // 검색 필터 주제
  const [searchFilter, setSearchFilter] = useState<EDUCATION_SEARCH_FILTER>(
    EDUCATION.NAME
  );

  // 검색 내용 ref
  const searchRef = useRef<HTMLInputElement>(null);
  // 검색 필터 내용
  const [searchValue, setSearchValue] = useState<string>(BLANK);

  // 필터 내용 태그
  const [filteredItems, setFilteredItems] = useState<
    EducationFilteredItemType[]
  >([]);

  // 검색 주제 선택
  const onClickSearchFilterItem = (value: EDUCATION_SEARCH_FILTER) => {
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
      setEducationFilter({ ...educationFilter, [searchFilter]: searchValue })
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
    let newFilterItems: EducationFilteredItemType[] = [];

    // 이름
    if (educationFilter.name) {
      newFilterItems.push({
        title: EDUCATION.NAME,
        value: [educationFilter.name],
      });
    }

    setFilteredItems(newFilterItems);
  }, [educationFilter]);

  const props = {
    searchFilter,
    searchValue,
    searchRef,
    filteredItems,
    onClickSearchFilterItem,
    onChangeSearchValue,
    onClickSearch,
    onKeyDown,
  };

  return (
    <>
      <EducationRowView {...props} />
    </>
  );
};

export default EducationRow;
