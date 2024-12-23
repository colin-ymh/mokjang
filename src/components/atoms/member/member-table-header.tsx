import { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import { MainText } from "@/components/atoms/common/text/main-text";
import { WHITE } from "@/constants/styles/color";
import TransparentBackground from "@/components/atoms/common/etc/transparent-background";
import Dropdown from "@/components/atoms/common/dropdown/dropdown";
import { useGenderDropdownItems } from "@/hooks/dropdown/dropdown-items";
import CheckList from "@/components/atoms/common/input/check-list";

const HeaderContainer = styled.div`
  display: flex;
  position: relative;
`;

const TextContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const FilterContainer = styled.div<{ $isOpened: boolean }>`
  position: absolute;
  z-index: 50;
  top: 30px;
  right: 0;
  opacity: ${({ $isOpened }) => ($isOpened ? 1 : 0)}; /* 투명도 변경 */
  visibility: ${({ $isOpened }) =>
    $isOpened ? "visible" : "hidden"}; /* 보임 상태 */
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease; /* 트랜지션 효과 */

  width: 200px;
  background: ${WHITE};
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
`;

type MemberTableHeaderProps = {
  item: {
    id: string;
    title: string;
  };
};

const MemberTableHeader = ({ item }: MemberTableHeaderProps) => {
  const memberFilter = useSelector(
    (state: RootState) => state.memberFilter.memberFilter,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);

  const [value, setValue] = useState<any>(null);

  const onClickBackground = () => {
    setIsFilterOpened(false);
  };

  return (
    <HeaderContainer>
      <TextContainer onClick={() => setIsFilterOpened(!isFilterOpened)}>
        <MainText>{item.title}</MainText>
      </TextContainer>
      <TransparentBackground
        isOpened={isFilterOpened}
        onClick={onClickBackground}
        blur={false}
      />
      <FilterContainer $isOpened={isFilterOpened}>
        {/*<CheckList values={memberFilter.}/>*/}
      </FilterContainer>
    </HeaderContainer>
  );
};

export default MemberTableHeader;
