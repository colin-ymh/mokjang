import { useState } from "react";

import MemberFilterView from "@/components/molecules/member/member-filter.view";

const MemberFilter = () => {
  // 필터 추가 모달 on off
  const [isAddFilterShown, setIsAddFilterShown] = useState<boolean>(false);

  // 필터 추가 모달 열기
  const onClickOpenFilter = () => {
    setIsAddFilterShown(true);
  };

  const props = {
    isAddFilterShown,
    setIsAddFilterShown,
    onClickOpenFilter,
  };

  return (
    <>
      <MemberFilterView {...props} />
    </>
  );
};

export default MemberFilter;
