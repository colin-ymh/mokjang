import styled from "styled-components";
import { MainText } from "@/components/atoms/common/text/main-text";
import { MEMBER } from "@/constants/member/member-column";
import { GRAY, MAIN } from "@/constants/styles/color";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ORDER_DIRECTION } from "@/constants/constant";
import { SIZE } from "@/constants/styles/style";

const HeaderContainer = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 5px;
  margin-bottom: 3px;
`;

type MemberTableHeaderProps = {
  item: {
    id: MEMBER;
    title: string;
    isSortable?: boolean;
  };
  onClick: (id: MEMBER) => void;
};

const MemberTableHeader = ({ item, onClick }: MemberTableHeaderProps) => {
  const { memberOrderBy, memberOrderDirection } = useSelector(
    (state: RootState) => state.memberFilter,
  );

  const isActive = memberOrderBy === item.id; // 현재 정렬 기준인지 확인
  const isAscending = memberOrderDirection === ORDER_DIRECTION.ASC; // 정렬 방향 확인

  return (
    <HeaderContainer onClick={() => item?.isSortable && onClick(item.id)}>
      <TextContainer>
        <MainText color={isActive ? MAIN.DEFAULT : GRAY.DARK}>
          {item.title}
        </MainText>
      </TextContainer>
      {item.isSortable && (
        <IconContainer>
          <MainText
            size={SIZE.LARGE}
            color={isActive ? MAIN.DEFAULT : GRAY.DEFAULT}
          >
            {isActive ? (isAscending ? "▼" : "▲") : "⇅"}
          </MainText>
        </IconContainer>
      )}
    </HeaderContainer>
  );
};

export default MemberTableHeader;
