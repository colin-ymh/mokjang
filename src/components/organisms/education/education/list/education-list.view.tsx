import styled from 'styled-components';
import React from 'react';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import EducationRow from '@/components/molecules/education/education/education-row';
import EducationTable, {
  EducationTableProps,
} from '@/components/molecules/education/education/education-table';

const EducationListContainer = styled.div`
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

type EducationListViewProps = {
  list: EducationTableProps;
};

const EducationListView = (props: EducationListViewProps) => {
  return (
    <EducationListContainer>
      {/* 모바일에서 보일 목록형 UI */}
      {/*<MobileView>*/}
      {/*  <EducationItemList {...props.list} />*/}
      {/*</MobileView>*/}
      {/* 데스크탑에서 보일 테이블형 UI */}
      <DesktopView>
        <EducationRow />
        <EducationTable {...props.list} />
      </DesktopView>
    </EducationListContainer>
  );
};

export default EducationListView;
