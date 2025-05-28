import styled from 'styled-components';
import Loading from '@/components/atoms/common/etc/loading';
import React from 'react';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import UserTable, {
  UserTableProps,
} from '@/components/molecules/user/user-table';
import UserRow from '@/components/molecules/user/user-row';

const UserListContainer = styled.div`
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
type UserListViewProps = {
  list: UserTableProps;
  information: {
    isLoading: boolean;
  };
};

const UserListView = (props: UserListViewProps) => {
  const { isLoading } = props.information;

  return (
    <UserListContainer>
      {/* 모바일에서 보일 목록형 UI */}
      {/*<MobileView>*/}
      {/*  <UserItemList {...props.list} />*/}
      {/*</MobileView>*/}
      {/* 데스크탑에서 보일 테이블형 UI */}
      <DesktopView>
        <UserRow />
        <UserTable {...props.list} />
      </DesktopView>
      <Loading isShow={isLoading} />
    </UserListContainer>
  );
};

export default UserListView;
