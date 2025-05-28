import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { getTrimmedString } from '@/utils/format';
import { USER } from '@/constants/user/user-column';
import { BLANK } from '@/constants/constant';
import UserRowView, {
  USER_SEARCH_FILTER,
} from '@/components/molecules/user/user-row.view';
import { UserFilteredItemType } from '@/components/atoms/user/user-filtered-item';
import { setUserFilter } from '@/redux/reducers/filter/user-filter-reducer';

const UserRow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userFilter } = useSelector((state: RootState) => state.userFilter);

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
    dispatch(setUserFilter({ ...userFilter, [searchFilter]: searchValue }));
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
    // if (userFilter.status.length > 0) {
    //   newFilterItems.push({
    //     title: USER.STATUS,
    //     value: userFilter.status,
    //   });
    // } else {
    //   setStatusFilter(undefined);
    // }
    //
    // // 방식
    // if (userFilter.userMethod.length > 0) {
    //   newFilterItems.push({
    //     title: USER.METHOD,
    //     value: userFilter.userMethod,
    //   });
    // }
    // // 종류
    // if (userFilter.userType.length > 0) {
    //   newFilterItems.push({
    //     title: USER.TYPE,
    //     value: userFilter.userType,
    //   });
    // }
    //
    // // 일자
    // if (userFilter.fromStartDate || userFilter.toStartDate) {
    //   newFilterItems.push({
    //     title: USER.DATE,
    //     value: [userFilter.fromStartDate, userFilter.toStartDate],
    //   });
    // }
    //
    // 이름
    if (userFilter.name) {
      newFilterItems.push({
        title: USER.NAME,
        value: [userFilter.name],
      });
    }

    setFilteredItems(newFilterItems);
  }, [userFilter]);

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
      <UserRowView {...props} />
    </>
  );
};

export default UserRow;
