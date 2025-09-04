import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import {
  setFilteredItems,
  setMemberFilter,
} from '../../../../redux/reducers/filter/member-filter-reducer';

import { getTrimmedString } from '@mokjang/utils';
import MemberFilterRowView from './member-filter-row.view';
import { MEMBER } from '@mokjang/constants';
import { BLANK } from '@mokjang/constants';
import { FilteredItemType } from '../../../atoms/member/setting/filtered-item.view';

const MemberFilterRow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { memberFilter } = useSelector(
    (state: RootState) => state.memberFilter
  );
  // 그룹 필터 설정 on off
  const [isGroupFilterShown, setIsGroupFilterShown] = useState<boolean>(false);

  // 교인 필터 설정 on off
  const [isMemberFilterShown, setIsMemberFilterShown] =
    useState<boolean>(false);

  // 표시 항목 설정 on off
  const [isHeaderFilterShown, setIsHeaderFilterShown] =
    useState<boolean>(false);

  // 그룹 필터 설정 열기
  const onClickGroupFilterOpen = () => {
    setIsGroupFilterShown(true);
  };

  // 그룹 필터 설정 닫기
  const onClickGroupFilterClose = () => {
    setIsGroupFilterShown(false);
  };

  // 교인 필터 설정 열기
  const onClickMemberFilterOpen = () => {
    setIsMemberFilterShown(true);
  };

  // 교인 필터 설정 닫기
  const onClickMemberFilterClose = () => {
    setIsMemberFilterShown(false);
  };

  // 표시 항목 설정 열기
  const onClickHeaderFilterOpen = () => {
    setIsHeaderFilterShown(true);
  };

  // 표시 항목 설정 닫기
  const onClickHeaderFilterClose = () => {
    setIsHeaderFilterShown(false);
  };

  // 검색 내용 ref
  const searchRef = useRef<HTMLInputElement>(null);
  // 검색 필터 내용
  const [searchValue, setSearchValue] = useState<string>(BLANK);

  // 검색 내용 변경
  const onChangeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = getTrimmedString(event.target.value);
    setSearchValue(newValue);
  };

  // 검색 버튼
  const onClickSearch = () => {
    dispatch(setMemberFilter({ ...memberFilter, search: searchValue }));
  };

  // 검색 중 엔터
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchRef.current === document.activeElement) {
      onClickSearch();
    }
  };

  // 필터된 내용들을 태그 형식으로 변환
  useEffect(() => {
    let newFilterItems: FilteredItemType[] = [];

    // 그룹
    if (memberFilter.groupIds.length > 0) {
      newFilterItems.push({
        title: MEMBER.GROUP,
        value: memberFilter.groupIds,
      });
    }

    // 직분
    if (memberFilter.officerIds.length > 0) {
      newFilterItems.push({
        title: MEMBER.OFFICER,
        value: memberFilter.officerIds,
      });
    }
    // 결혼
    if (memberFilter.marriageStatuses.length > 0) {
      newFilterItems.push({
        title: MEMBER.MARRIAGE,
        value: memberFilter.marriageStatuses,
      });
    }
    // 신급
    if (memberFilter.baptismStatuses.length > 0) {
      newFilterItems.push({
        title: MEMBER.BAPTISM,
        value: memberFilter.baptismStatuses,
      });
    }

    // 생년월일
    if (memberFilter.birthFrom || memberFilter.birthTo) {
      newFilterItems.push({
        title: MEMBER.BIRTH,
        value: [memberFilter.birthFrom, memberFilter.birthTo],
      });
    }

    // 등록일
    if (memberFilter.registeredFrom || memberFilter.registeredTo) {
      newFilterItems.push({
        title: MEMBER.REGISTERED_AT,
        value: [memberFilter.registeredFrom, memberFilter.registeredTo],
      });
    }

    // 이름
    if (memberFilter.search) {
      newFilterItems.push({
        title: MEMBER.SEARCH,
        value: [memberFilter.search],
      });
    }

    dispatch(setFilteredItems(newFilterItems));
  }, [memberFilter]);

  const props = {
    isGroupFilterShown,
    isMemberFilterShown,
    isHeaderFilterShown,
    searchValue,
    searchRef,
    onClickGroupFilterOpen,
    onClickGroupFilterClose,
    onClickMemberFilterOpen,
    onClickMemberFilterClose,
    onClickHeaderFilterOpen,
    onClickHeaderFilterClose,
    onChangeSearchValue,
    onClickSearch,
    onKeyDown,
  };

  return (
    <>
      <MemberFilterRowView {...props} />
    </>
  );
};

export default MemberFilterRow;
