import styled from "styled-components";

import { GRAY } from "@/common/styles/color";
import SideBarButton from "@/components/atoms/layout/side-bar/side-bar-button";
import SideBarHeader from "@/components/atoms/layout/side-bar/side-bar-header";
import { MEDIA_MIN_WIDTH } from "@/constant/constant";
import { useSideBarItems } from "@/constant/layout/side-bar-items";

const SideBarContainer = styled.div`
  // 모바일
  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    display: none;
  }

  // 태블릿
  @media (min-width: ${MEDIA_MIN_WIDTH.TABLET}) {
    display: none;
  }

  // 데크스탑
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: column;
    width: 230px;
    background-color: ${GRAY.LIGHT};
    padding: 10px;
    box-shadow: inset -2px 0 5px rgba(0, 0, 0, 0.2);
  }
`;

type SideBarViewProps = {
  onClickButton: (id: string) => void;
};

const SideBarView = ({ onClickButton }: SideBarViewProps) => {
  return (
    <SideBarContainer>
      <SideBarHeader />
      {useSideBarItems().map(({ id, title }) => {
        return <SideBarButton id={id} title={title} />;
      })}
    </SideBarContainer>
  );
};

export default SideBarView;
