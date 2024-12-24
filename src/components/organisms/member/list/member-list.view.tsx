import styled from "styled-components";

import MemberTable, {
  MemberTableProps,
} from "@/components/molecules/member/list/member-table";
import MemberFilter from "@/components/molecules/member/list/member-filter";
import { MEDIA_MIN_WIDTH } from "@/constants/constant";
import MemberItemList from "@/components/molecules/member/list/member-item-list";

const MemberListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MobileView = styled.div`
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: none;
  }
`;

const DesktopView = styled.div`
  display: none;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
  }
`;

const MemberListView = (props: MemberTableProps) => {
  return (
    <MemberListContainer>
      <MemberFilter />
      {/* 모바일에서 보일 목록형 UI */}
      <MobileView>
        <MemberItemList {...props} />
      </MobileView>
      {/* 데스크탑에서 보일 테이블형 UI */}
      <DesktopView>
        <MemberTable {...props} />
      </DesktopView>
    </MemberListContainer>
  );
};

export default MemberListView;
