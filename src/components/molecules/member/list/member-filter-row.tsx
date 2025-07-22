import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  setFilteredItems,
  setMemberFilter,
} from '@/redux/reducers/filter/member-filter-reducer';

import {
  getFormattedHomePhone,
  getFormattedMobilePhone,
  getTrimmedString,
} from '@/utils/format';
import MemberFilterRowView, {
  SEARCH_FILTER,
} from '@/components/molecules/member/list/member-filter-row.view';
import { MEMBER } from '@/constants/column/member-column';
import { BLANK } from '@/constants/constant';
import { FilteredItemType } from '@/components/atoms/member/setting/filtered-item.view';

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

  // 검색 필터 주제
  const [searchFilter, setSearchFilter] = useState<SEARCH_FILTER>(MEMBER.NAME);
  // 검색 내용 ref
  const searchRef = useRef<HTMLInputElement>(null);
  // 검색 필터 내용
  const [searchValue, setSearchValue] = useState<string>(BLANK);

  // 검색 주제 선택
  const onClickSearchFilterItem = (value: SEARCH_FILTER) => {
    setSearchFilter(value);
  };

  // 검색 내용 변경
  const onChangeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = getTrimmedString(event.target.value);
    setSearchValue(newValue);
  };

  // 검색 버튼
  const onClickSearch = () => {
    dispatch(setMemberFilter({ ...memberFilter, [searchFilter]: searchValue }));
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
    if (memberFilter.group.id) {
      newFilterItems.push({
        title: MEMBER.GROUP,
        value: [memberFilter.group.id],
      });
    }

    // 성별
    if (memberFilter.gender.length > 0) {
      newFilterItems.push({ title: MEMBER.GENDER, value: memberFilter.gender });
    }
    // 직분
    if (memberFilter.officer.length > 0) {
      newFilterItems.push({
        title: MEMBER.OFFICER,
        value: memberFilter.officer,
      });
    }
    // 결혼
    if (memberFilter.marriage.length > 0) {
      newFilterItems.push({
        title: MEMBER.MARRIAGE,
        value: memberFilter.marriage,
      });
    }
    // 신급
    if (memberFilter.baptism.length > 0) {
      newFilterItems.push({
        title: MEMBER.BAPTISM,
        value: memberFilter.baptism,
      });
    }

    // 생년월일
    if (memberFilter.birthAfter || memberFilter.birthBefore) {
      newFilterItems.push({
        title: MEMBER.AGE,
        value: [memberFilter.birthAfter, memberFilter.birthBefore],
      });
    }

    // 등록일
    if (memberFilter.registerAfter || memberFilter.registerBefore) {
      newFilterItems.push({
        title: MEMBER.REGISTERED_AT,
        value: [memberFilter.registerAfter, memberFilter.registerBefore],
      });
    }

    // 수정일
    if (memberFilter.updateAfter || memberFilter.updateBefore) {
      newFilterItems.push({
        title: MEMBER.UPDATED_AT,
        value: [memberFilter.updateAfter, memberFilter.updateBefore],
      });
    }

    // 이름
    if (memberFilter.name) {
      newFilterItems.push({
        title: MEMBER.NAME,
        value: [memberFilter.name],
      });
    }

    // 직업
    if (memberFilter.occupation) {
      newFilterItems.push({
        title: MEMBER.OCCUPATION,
        value: [memberFilter.occupation],
      });
    }
    // 학교
    if (memberFilter.school) {
      newFilterItems.push({
        title: MEMBER.SCHOOL,
        value: [memberFilter.school],
      });
    }
    // 차량 번호
    if (memberFilter.vehicleNumber) {
      newFilterItems.push({
        title: MEMBER.VEHICLE_NUMBER,
        value: [memberFilter.vehicleNumber],
      });
    }

    // 주소
    if (memberFilter.address) {
      newFilterItems.push({
        title: MEMBER.ADDRESS,
        value: [memberFilter.address],
      });
    }
    // 휴대전화
    if (memberFilter.mobilePhone) {
      newFilterItems.push({
        title: MEMBER.MOBILE_PHONE,
        value: [getFormattedMobilePhone(memberFilter.mobilePhone)],
      });
    }
    // 집전화
    if (memberFilter.homePhone) {
      newFilterItems.push({
        title: MEMBER.HOME_PHONE,
        value: [getFormattedHomePhone(memberFilter.homePhone)],
      });
    }

    dispatch(setFilteredItems(newFilterItems));
  }, [memberFilter]);

  const props = {
    isGroupFilterShown,
    isMemberFilterShown,
    isHeaderFilterShown,
    searchFilter,
    searchValue,
    searchRef,
    onClickGroupFilterOpen,
    onClickGroupFilterClose,
    onClickMemberFilterOpen,
    onClickMemberFilterClose,
    onClickHeaderFilterOpen,
    onClickHeaderFilterClose,
    onClickSearchFilterItem,
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
