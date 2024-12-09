import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setGenderFilter } from "@/redux/reducers/member-filter-reducer";

import { GENDER, NONE } from "@/constants/constant";
import MemberFilterView from "@/components/molecules/member/member-filter.view";

const MemberFilter = () => {
  const dispatch = useDispatch<AppDispatch>();

  // 성별 필터 토글
  const onClickGenderToggle = (value: GENDER | typeof NONE) => {
    dispatch(setGenderFilter(value));
  };

  const props = {
    onClickGenderToggle,
  };
  return (
    <>
      <MemberFilterView {...props} />
    </>
  );
};

export default MemberFilter;
