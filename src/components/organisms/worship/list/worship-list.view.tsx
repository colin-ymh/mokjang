import styled from 'styled-components';
import React from 'react';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import WorshipTable, {
  WorshipTableProps,
} from '@/components/molecules/worship/worship-table';
import { WHITE } from '@/constants/styles/color';

const WorshipListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  background-color: ${WHITE};
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

type WorshipListViewProps = {
  list: WorshipTableProps;
};

const WorshipListView = (props: WorshipListViewProps) => {
  return (
    <WorshipListContainer>
      {/* 모바일에서 보일 목록형 UI */}
      {/*<MobileView>*/}
      {/*  <WorshipItemList {...props.list} />*/}
      {/*</MobileView>*/}
      {/* 데스크탑에서 보일 테이블형 UI */}
      <DesktopView>
        <WorshipTable {...props.list} />
      </DesktopView>
    </WorshipListContainer>
  );
};

export default WorshipListView;
