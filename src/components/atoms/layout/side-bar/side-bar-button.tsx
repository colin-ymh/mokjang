import styled from "styled-components";

import { BLACK, GRAY, MAIN } from "@/constants/styles/color";
import { MainText } from "@/components/atoms/common/text/main-text";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setHeaderId } from "@/redux/reducers/layout-reducer";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 5px 10px;
  height: 40px;
  border-radius: 5px;
  gap: 10px;
  align-items: center;

  &:hover {
    background-color: ${GRAY.DEFAULT};
  }
`;

const Icon = styled.div`
  display: flex;
  width: 15px;
  height: 15px;
  background-color: ${BLACK};
`;

type SideBarButtonProps = {
  id: string;
  title: string;
};

const SideBarButton = ({ id, title }: SideBarButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const headerId = useSelector((state: RootState) => state.layout.headerId);

  const onClick = (id: string) => {
    dispatch(setHeaderId(id));
  };

  return (
    <ButtonContainer onClick={() => onClick(id)}>
      <Icon />
      <MainText fontSize={15} color={id === headerId ? MAIN.DEFAULT : BLACK}>
        {title}
      </MainText>
    </ButtonContainer>
  );
};

export default SideBarButton;
