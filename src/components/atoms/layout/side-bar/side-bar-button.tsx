import styled from "styled-components";

import { BLACK, GRAY, MAIN } from "@/constants/styles/color";
import { MainText } from "@/components/atoms/common/text/main-text";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setContentId, setHeaderId } from "@/redux/reducers/layout-reducer";
import { HEADER_ID } from "@/constants/layout/header";
import { HOME_CONTENT_ID, MEMBER_CONTENT_ID } from "@/constants/layout/content";
import { setMemberFilter } from "@/redux/reducers/member-filter-reducer";
import { BLANK } from "@/constants/constant";
import { SIZE } from "@/constants/styles/style";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 5px 10px;
  height: 30px;
  border-radius: 5px;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

type SideBarButtonProps = {
  id: string;
  title: string;
};

const SideBarButton = ({ id, title }: SideBarButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const headerId = useSelector((state: RootState) => state.layout.headerId);
  const memberFilter = useSelector(
    (state: RootState) => state.memberFilter.memberFilter,
  );

  const onClick = (id: string) => {
    dispatch(setHeaderId(id));

    switch (id) {
      case HEADER_ID.HOME:
        dispatch(setContentId(HOME_CONTENT_ID.HOME));
        return;
      case HEADER_ID.MEMBER:
        dispatch(setContentId(MEMBER_CONTENT_ID.MEMBER));
        dispatch(setMemberFilter({ ...memberFilter, groupId: BLANK }));
        return;
    }
  };

  return (
    <ButtonContainer onClick={() => onClick(id)}>
      <MainText
        size={SIZE.LARGE}
        fontWeight={600}
        color={id === headerId ? MAIN.DEFAULT : GRAY.DARK}
      >
        {title}
      </MainText>
    </ButtonContainer>
  );
};

export default SideBarButton;
