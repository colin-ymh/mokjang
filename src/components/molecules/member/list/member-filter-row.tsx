import { ChangeEvent, useState } from "react";

import MemberFilterRowView, {
  SEARCH_FILTER,
} from "@/components/molecules/member/list/member-filter-row.view";
import { MEMBER } from "@/constants/member/member-column";
import { BLANK } from "@/constants/constant";
import { getTrimmedString } from "@/utils/format";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setMemberFilter } from "@/redux/reducers/member-filter-reducer";

const MemberFilterRow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { memberFilter } = useSelector(
    (state: RootState) => state.memberFilter,
  );
  // 목록 설정  모달 on off
  const [isAddFilterShown, setIsAddFilterShown] = useState<boolean>(false);

  // 목록 설정 모달 열기
  const onClickTableSetting = () => {
    setIsAddFilterShown(!isAddFilterShown);
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

  // 검색 버튼
  const onClickSearch = () => {
    dispatch(setMemberFilter({ ...memberFilter, [searchFilter]: searchValue }));
  };

  const props = {
    isAddFilterShown,
    searchFilter,
    searchValue,
    setIsAddFilterShown,
    onClickTableSetting,
    onClickSearchFilterItem,
    onChangeSearchValue,
    onClickSearch,
  };

  return (
    <>
      <MemberFilterRowView {...props} />
    </>
  );
};

export default MemberFilterRow;
