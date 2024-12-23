import styled from "styled-components";

import { GRAY } from "@/constants/styles/color";
import SideBarButton from "@/components/atoms/layout/side-bar/side-bar-button";
import SideBarHeader from "@/components/atoms/layout/side-bar/side-bar-header";
import { MEDIA_MIN_WIDTH } from "@/constants/constant";
import { useSideBarItems } from "@/hooks/layout/side-bar-items";
import { HEADER_ID } from "@/constants/layout/header";
import GroupFilter from "@/components/molecules/layout/group-filter";

import { useScopedI18n } from "../../../../locales/client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const SideBarContainer = styled.div`
  // 모바일
  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    display: none;
  }

  // 태블릿
  @media (min-width: ${MEDIA_MIN_WIDTH.TABLET}) {
    display: none;
  }

  // 데스크탑
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: column;
    width: 200px;
    background-color: ${GRAY.SIDE_BAR};
    padding: 10px;
    box-shadow: inset -2px 0 5px rgba(0, 0, 0, 0.2);
    height: 100vh; /* 전체 높이 */
    overflow: hidden; /* 내용이 넘치지 않도록 설정 */
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px;
  flex-shrink: 0; /* 크기가 줄어들지 않도록 설정 */
`;

const GroupFilterContainer = styled.div<{ $isOpened: boolean }>`
  overflow-y: auto; /* 내용이 많아질 경우 스크롤 활성화 */
  margin-top: 10px;
  display: ${({ $isOpened }) => ($isOpened ? "flex" : "none")};
`;

const SideBarView = () => {
  const sideBarItems = useSideBarItems();
  const t_header = useScopedI18n("header");
  const headerId = useSelector((state: RootState) => state.layout.headerId);

  return (
    <SideBarContainer>
      <SideBarHeader />
      <ButtonContainer>
        <SideBarButton id={HEADER_ID.HOME} title={t_header(HEADER_ID.HOME)} />
        <SideBarButton
          id={HEADER_ID.MEMBER}
          title={t_header(HEADER_ID.MEMBER)}
        />
      </ButtonContainer>
      <GroupFilterContainer $isOpened={headerId === HEADER_ID.MEMBER}>
        <GroupFilter />
      </GroupFilterContainer>
    </SideBarContainer>
  );
};

export default SideBarView;
