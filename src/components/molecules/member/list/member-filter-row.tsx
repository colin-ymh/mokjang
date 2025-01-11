import { ChangeEvent, useEffect, useRef, useState } from 'react';

import MemberFilterRowView, {
  SEARCH_FILTER,
} from '@/components/molecules/member/list/member-filter-row.view';
import { MEMBER } from '@/constants/member/member-column';
import { BLANK } from '@/constants/constant';
import { getTrimmedString } from '@/utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setMemberFilter } from '@/redux/reducers/member-filter-reducer';
import { FilteredItemType } from '@/components/atoms/member/list/filtered-item';

const MemberFilterRow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { memberFilter } = useSelector(
    (state: RootState) => state.memberFilter
  );
  // 목록 설정  모달 on off
  const [isAddFilterShown, setIsAddFilterShown] = useState<boolean>(false);

  // 목록 설정 모달 열기
  const onClickTableManagement = () => {
    setIsAddFilterShown(!isAddFilterShown);
  };

  // 검색 필터 주제
  const [searchFilter, setSearchFilter] = useState<SEARCH_FILTER>(MEMBER.NAME);
  // 검색 내용 ref
  const searchRef = useRef<HTMLInputElement>(null);
  // 검색 필터 내용
  const [searchValue, setSearchValue] = useState<string>(BLANK);

  // 필터 내용 태그
  const [filteredItems, setFilteredItems] = useState<FilteredItemType[]>([]);

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

    // 성별
    if (memberFilter.gender.length > 0) {
      memberFilter.gender.forEach((item) => {
        newFilterItems.push({ title: MEMBER.GENDER, value: item });
      });
    }
    // 직분
    if (memberFilter.officer.length > 0) {
      memberFilter.officer.forEach((item) => {
        newFilterItems.push({ title: MEMBER.OFFICER, value: item });
      });
    }
    // 결혼
    if (memberFilter.marriage.length > 0) {
      memberFilter.marriage.forEach((item) => {
        newFilterItems.push({ title: MEMBER.MARRIAGE, value: item });
      });
    }
    // 신급
    if (memberFilter.baptism.length > 0) {
      memberFilter.baptism.forEach((item) => {
        newFilterItems.push({ title: MEMBER.BAPTISM, value: item });
      });
    }

    // 생년월일 ~부터
    if (memberFilter.birthAfter) {
      newFilterItems.push({
        title: MEMBER.BIRTH_AFTER,
        value: memberFilter.birthAfter,
      });
    }

    // 생년월일 ~까지
    if (memberFilter.birthBefore) {
      newFilterItems.push({
        title: MEMBER.BIRTH_BEFORE,
        value: memberFilter.birthBefore,
      });
    }

    // 등록일 ~부터
    if (memberFilter.registerAfter) {
      newFilterItems.push({
        title: MEMBER.REGISTER_AFTER,
        value: memberFilter.registerAfter,
      });
    }

    // 등록일 ~까지
    if (memberFilter.registerBefore) {
      newFilterItems.push({
        title: MEMBER.REGISTER_BEFORE,
        value: memberFilter.registerBefore,
      });
    }

    // 수정일 ~부터
    if (memberFilter.updateAfter) {
      newFilterItems.push({
        title: MEMBER.UPDATE_AFTER,
        value: memberFilter.updateAfter,
      });
    }

    // 수정일 ~까지
    if (memberFilter.updateBefore) {
      newFilterItems.push({
        title: MEMBER.UPDATE_BEFORE,
        value: memberFilter.updateBefore,
      });
    }

    // 이름
    if (memberFilter.name) {
      newFilterItems.push({
        title: MEMBER.NAME,
        value: memberFilter.name,
      });
    }
    // 직업
    if (memberFilter.occupation) {
      newFilterItems.push({
        title: MEMBER.OCCUPATION,
        value: memberFilter.occupation,
      });
    }
    // 학교
    if (memberFilter.school) {
      newFilterItems.push({
        title: MEMBER.SCHOOL,
        value: memberFilter.school,
      });
    }
    // 차량 번호
    if (memberFilter.vehicleNumber) {
      newFilterItems.push({
        title: MEMBER.VEHICLE_NUMBER,
        value: memberFilter.vehicleNumber,
      });
    }

    setFilteredItems(newFilterItems);
  }, [memberFilter]);

  const props = {
    isAddFilterShown,
    searchFilter,
    searchValue,
    searchRef,
    filteredItems,
    setIsAddFilterShown,
    onClickTableManagement,
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
