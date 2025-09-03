import styled from 'styled-components';
import { Loading } from '../../../../../../../packages/components/src';
import React from 'react';
import {
  GRAY,
  MEDIA_MIN_WIDTH,
} from '../../../../../../../packages/constants/src';
import JoinRequestTable, {
  JoinRequestTableProps,
} from '../../../molecules/join-request/join-request-table';

const JoinRequestListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
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
  gap: 20px;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: column;
  }
`;

const TableContainer = styled.div`
  display: flex;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  overflow: hidden;
`;

type JoinRequestListViewProps = {
  list: JoinRequestTableProps;
  information: {
    isLoading: boolean;
  };
};

const JoinRequestListView = (props: JoinRequestListViewProps) => {
  const { isLoading } = props.information;

  return (
    <JoinRequestListContainer>
      {/* 모바일에서 보일 목록형 UI */}
      {/*<MobileView>*/}
      {/*  <JoinRequestItemList {...props.list} />*/}
      {/*</MobileView>*/}
      {/* 데스크탑에서 보일 테이블형 UI */}
      <DesktopView>
        <TableContainer>
          <JoinRequestTable {...props.list} />
        </TableContainer>
      </DesktopView>
      <Loading isShow={isLoading} />
    </JoinRequestListContainer>
  );
};

export default JoinRequestListView;
