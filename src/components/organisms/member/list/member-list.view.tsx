import styled from 'styled-components';

import MemberTable, {
  MemberTableProps,
} from '@/components/molecules/member/list/member-table';
import MemberFilterRow from '@/components/molecules/member/list/member-filter-row';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import MemberItemList from '@/components/molecules/member/list/member-item-list';

const MemberListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
`;

const MobileView = styled.div`
  display: flex;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: none;
  }
`;

const DesktopView = styled.div`
  display: none;
  justify-content: flex-start;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: column;
  }
`;

const MemberListView = (props: MemberTableProps) => {
  return (
    <MemberListContainer>
      {/* 모바일에서 보일 목록형 UI */}
      <MobileView>
        <MemberItemList {...props} />
      </MobileView>
      {/* 데스크탑에서 보일 테이블형 UI */}
      <DesktopView>
        <MemberFilterRow />
        <MemberTable {...props} />
      </DesktopView>
    </MemberListContainer>
  );
};

export default MemberListView;
