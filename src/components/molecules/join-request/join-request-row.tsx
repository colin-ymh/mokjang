import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/redux/store';
import { getTrimmedString } from '@/utils/format';
import { BLANK } from '@/constants/constant';
import { JOIN_REQUEST_STATUS } from '@/constants/status/status';
import { setJoinRequestFilter } from '@/redux/reducers/filter/join-request-filter-reducer';
import { JOIN_REQUEST } from '@/constants/join-request/join-request-column';
import JoinRequestRowView, {
  JOIN_REQUEST_SEARCH_FILTER,
} from '@/components/molecules/join-request/join-request-row.view';
import { JoinRequestFilteredItemType } from '@/components/atoms/join-request/join-request-filtered-item';

const JoinRequestRow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { joinRequestFilter } = useSelector(
    (state: RootState) => state.joinRequestFilter
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
    dispatch(
      setJoinRequestFilter({
        ...joinRequestFilter,
        [JOIN_REQUEST.FROM_CREATED_AT]: startDate,
        [JOIN_REQUEST.TO_CREATED_AT]: endDate,
      })
    );
    setIsAddFilterShown(false);
  };

  // 상태 필터
  const [statusFilter, setStatusFilter] = useState<
    JOIN_REQUEST_STATUS | undefined
  >(undefined);

  // 상태 선택
  const onClickStatusFilterItem = (value: JOIN_REQUEST_STATUS) => {
    // setStatusFilter(value);
    // if (value) {
    //   dispatch(
    //     setJoinRequestFilter({
    //       ...joinRequestFilter,
    //       [JOIN_REQUEST.STATUS]: [value],
    //     })
    //   );
    // } else {
    //   dispatch(
    //     setJoinRequestFilter({
    //       ...joinRequestFilter,
    //       [JOIN_REQUEST.STATUS]: [],
    //     })
    //   );
    // }
  };

  // 검색 필터 주제
  const [searchFilter, setSearchFilter] = useState<JOIN_REQUEST_SEARCH_FILTER>(
    JOIN_REQUEST.NAME
  );
  // 검색 내용 ref
  const searchRef = useRef<HTMLInputElement>(null);
  // 검색 필터 내용
  const [searchValue, setSearchValue] = useState<string>(BLANK);
  // 필터 내용 태그
  const [filteredItems, setFilteredItems] = useState<
    JoinRequestFilteredItemType[]
  >([]);

  // 검색 주제 선택
  const onClickSearchFilterItem = (value: JOIN_REQUEST_SEARCH_FILTER) => {
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
      setJoinRequestFilter({
        ...joinRequestFilter,
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
    let newFilterItems: JoinRequestFilteredItemType[] = [];

    // // 상태
    // if (joinRequestFilter.status.length > 0) {
    //   newFilterItems.push({
    //     title: JOIN_REQUEST.STATUS,
    //     value: joinRequestFilter.status,
    //   });
    // } else {
    //   setStatusFilter(undefined);
    // }

    // 등록일
    if (joinRequestFilter.fromCreatedAt || joinRequestFilter.toCreatedAt) {
      newFilterItems.push({
        title: JOIN_REQUEST.CREATED_AT,
        value: [joinRequestFilter.fromCreatedAt, joinRequestFilter.toCreatedAt],
      });
    }

    // 이름
    if (joinRequestFilter.name) {
      newFilterItems.push({
        title: JOIN_REQUEST.NAME,
        value: [joinRequestFilter.name],
      });
    }

    setFilteredItems(newFilterItems);
  }, [joinRequestFilter]);

  const props = {
    isModalShown,
    searchFilter,
    searchValue,
    searchRef,
    statusFilter,
    filteredItems,
    onClickStatusFilterItem,
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
      <JoinRequestRowView {...props} />
    </>
  );
};

export default JoinRequestRow;
