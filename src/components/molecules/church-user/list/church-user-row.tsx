import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { getTrimmedString } from '@/utils/format';
import { USER } from '@/constants/user/user-column';
import { BLANK } from '@/constants/constant';
import ChurchUserRowView, {
  USER_SEARCH_FILTER,
} from '@/components/molecules/church-user/list/church-user-row.view';
import { UserFilteredItemType } from '@/components/atoms/church-user/list/church-user-filtered-item';
import { setChurchUserFilter } from '@/redux/reducers/filter/church-user-filter-reducer';

const ChurchUserRow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { churchUserFilter } = useSelector(
    (state: RootState) => state.churchUserFilter
  );

  // 검색 필터 주제
  const [searchFilter, setSearchFilter] = useState<USER_SEARCH_FILTER>(
    USER.NAME
  );
  // 검색 내용 ref
  const searchRef = useRef<HTMLInputElement>(null);
  // 검색 필터 내용
  const [searchValue, setSearchValue] = useState<string>(BLANK);

  // 필터 내용 태그
  const [filteredItems, setFilteredItems] = useState<UserFilteredItemType[]>(
    []
  );

  // 검색 주제 선택
  const onClickSearchFilterItem = (value: USER_SEARCH_FILTER) => {
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
      setChurchUserFilter({ ...churchUserFilter, [searchFilter]: searchValue })
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
    let newFilterItems: UserFilteredItemType[] = [];

    // // 상태
    // if (churchUserFilter.status.length > 0) {
    //   newFilterItems.push({
    //     title: USER.STATUS,
    //     value: churchUserFilter.status,
    //   });
    // } else {
    //   setStatusFilter(undefined);
    // }
    //
    // // 방식
    // if (churchUserFilter.userMethod.length > 0) {
    //   newFilterItems.push({
    //     title: USER.METHOD,
    //     value: churchUserFilter.userMethod,
    //   });
    // }
    // // 종류
    // if (churchUserFilter.userType.length > 0) {
    //   newFilterItems.push({
    //     title: USER.TYPE,
    //     value: churchUserFilter.userType,
    //   });
    // }
    //
    // // 일자
    // if (churchUserFilter.fromStartDate || churchUserFilter.toStartDate) {
    //   newFilterItems.push({
    //     title: USER.DATE,
    //     value: [churchUserFilter.fromStartDate, churchUserFilter.toStartDate],
    //   });
    // }
    //
    // 이름
    if (churchUserFilter.name) {
      newFilterItems.push({
        title: USER.NAME,
        value: [churchUserFilter.name],
      });
    }

    setFilteredItems(newFilterItems);
  }, [churchUserFilter]);

  useEffect(() => {}, []);

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
      <ChurchUserRowView {...props} />
    </>
  );
};

export default ChurchUserRow;
