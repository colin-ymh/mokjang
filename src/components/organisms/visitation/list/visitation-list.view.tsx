import styled from 'styled-components';

import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import VisitationRow from '@/components/molecules/visitation/visitation-row';
import VisitationTable, {
  VisitationTableProps,
} from '@/components/molecules/visitation/visitation-table';

const VisitationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
`;

const DesktopView = styled.div`
  display: none;
  justify-content: flex-start;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
  }
`;

const VisitationListView = (props: VisitationTableProps) => {
  return (
    <VisitationListContainer>
      <VisitationRow />

      {/*/!* 모바일에서 보일 목록형 UI *!/*/}
      {/*<MobileView>*/}
      {/*  <VisitationItemList {...props} />*/}
      {/*</MobileView>*/}
      {/* 데스크탑에서 보일 테이블형 UI */}
      <DesktopView>
        <VisitationTable {...props} />
      </DesktopView>
    </VisitationListContainer>
  );
};

export default VisitationListView;
