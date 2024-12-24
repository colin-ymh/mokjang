import { ChangeEvent, useState } from "react";

import MemberFilterView from "@/components/molecules/member/list/member-filter.view";
import { SEARCH_FILTER } from "@/components/molecules/member/list/add-filter.view";
import { MEMBER } from "@/constants/member/member-column";
import { BLANK } from "@/constants/constant";
import { getTrimmedString } from "@/utils/format";

const MemberFilter = () => {
  // 필터 추가 모달 on off
  const [isAddFilterShown, setIsAddFilterShown] = useState<boolean>(false);

  // 필터 추가 모달 열기
  const onClickOpenFilter = () => {
    setIsAddFilterShown(true);
  };

  // 검색 필터 주제
  const [searchFilter, setSearchFilter] = useState<SEARCH_FILTER>(MEMBER.NAME);

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

  const props = {
    isAddFilterShown,
    searchFilter,
    searchValue,
    setIsAddFilterShown,
    onClickOpenFilter,
    onClickSearchFilterItem,
    onChangeSearchValue,
  };

  return (
    <>
      <MemberFilterView {...props} />
    </>
  );
};

export default MemberFilter;
