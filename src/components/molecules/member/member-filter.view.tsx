import styled from "styled-components";

import Button from "@/components/atoms/common/button/button";
import { MainText } from "@/components/atoms/common/text/main-text";
import { MAIN, WHITE } from "@/constants/styles/color";
import { GENDER } from "@/constants/constant";
import { useI18n } from "../../../../locales/client";
import AddFilter from "@/components/molecules/member/add-filter";
import { Dispatch, SetStateAction } from "react";

const MemberFilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  gap: 10px;
`;

const FilterList = styled.div`
  display: flex;
  gap: 20px;
  justify-content: flex-start;
  align-items: center;
`;

const AddFilterContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? "flex" : "none")};
  position: absolute;
  right: 30px;
  top: 220px;
  z-index: 10;
  background-color: white;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
`;

type MemberFilterViewProps = {
  isAddFilterShown: boolean;
  setIsAddFilterShown: Dispatch<SetStateAction<boolean>>;
  onClickOpenFilter: () => void;
};

const MemberFilterView = ({
  isAddFilterShown,
  setIsAddFilterShown,
  onClickOpenFilter,
}: MemberFilterViewProps) => {
  const t = useI18n();

  return (
    <MemberFilterContainer>
      <FilterList></FilterList>
      <Button width={100} height={40} backgroundColor={MAIN.LIGHT}>
        <MainText color={WHITE} onClick={onClickOpenFilter}>
          필터 추가하기
        </MainText>
      </Button>
      {/* 필터 추가 모달 */}
      <AddFilterContainer $isShown={isAddFilterShown}>
        <AddFilter setIsShown={setIsAddFilterShown} />
      </AddFilterContainer>
    </MemberFilterContainer>
  );
};

export default MemberFilterView;
