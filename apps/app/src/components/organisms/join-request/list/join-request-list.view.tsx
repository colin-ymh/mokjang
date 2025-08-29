import styled from 'styled-components';
import Loading from '../../../atoms/common/etc/loading';
import React from 'react';
import { BLACK, DESTRUCTIVE } from '../../../../constants/styles/color';
import CancelIcon from '../../../../../public/svg/cancel.svg';
import TrashIcon from '../../../../../public/svg/trash.svg';
import { MEDIA_MIN_WIDTH } from '../../../../constants/constant';
import JoinRequestTable, {
  JoinRequestTableProps,
} from '../../../molecules/join-request/join-request-table';
import JoinRequestRow from '../../../molecules/join-request/join-request-row';

const JoinRequestListContainer = styled.div`
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

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

const Trash = styled(TrashIcon)`
  width: 25px;
  height: 25px;
  stroke: ${DESTRUCTIVE.LIGHT};
  stroke-width: 1px;
`;

const Cancel = styled(CancelIcon)`
  width: 30px;
  height: 30px;
  stroke: ${BLACK};
  stroke-width: 1px;
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
        <JoinRequestRow />
        <JoinRequestTable {...props.list} />
      </DesktopView>
      <Loading isShow={isLoading} />
    </JoinRequestListContainer>
  );
};

export default JoinRequestListView;
