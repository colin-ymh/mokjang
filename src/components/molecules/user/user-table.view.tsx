import React, { MutableRefObject } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, WHITE } from '@/constants/styles/color';
import { USER } from '@/constants/user/user-column';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BLANK } from '@/constants/constant';
import { User } from '@/models/user/user';
import useWindowSize from '@/hooks/window/window';
import UserTableHeader from '@/components/atoms/user/user-table-header';
import { BLANK_HEADER } from '@/redux/reducers/filter/member-filter-reducer';
import { getRandomImage } from '@/utils/image';
import { MEMBER } from '@/constants/member/member-column';

// 1. 컬럼별 PX 폭
const getColumnWidth = (id: string) => {
  switch (id) {
    case USER.NAME:
      return 200;
    case USER.MOBILE_PHONE:
      return 300;
    case MEMBER.NAME:
      return 200;
    default:
      // 비고(REMARKS) 컬럼 등
      return 80;
  }
};

// 2. 테이블 컨테이너 (100% 폭 + 스크롤)
const TableContainer = styled.div<{ height: number }>`
  /* 항상 가로 100%를 채움 */
  width: 100%;
  /* 세로 높이만큼 상하 스크롤 */
  height: ${({ height }) => `${height - 260}px`};

  /* 오버플로 시 스크롤 */
  overflow-x: auto;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
`;

// 3. 테이블은 width: 100% + table-layout: fixed
const UserTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
  /* 아래 옵션으로 텍스트 줄바꿈 등 처리. 
         white-space: nowrap; 로 하면 줄바꿈 없이 가로로 늘어나게 됨 */
  white-space: normal;
`;

// 4. 헤더(TH)
const TableHeader = styled.th<{ id: string; $isLast?: boolean }>`
  padding: 3px 10px;
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: ${WHITE};

  /* 만약 마지막 컬럼이면 width: auto */
  width: ${({ id, $isLast }) => ($isLast ? 'auto' : `${getColumnWidth(id)}px`)};
  /* 텍스트 넘침 처리 */
  overflow: hidden;
  text-overflow: ellipsis;

  /* pseudo‐element 로 보더를 직접 그려서 절대 안 사라지게 */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 0.7px;
    background: ${GRAY.SEMI_LIGHT};
  }
`;

// 5. 본문(TR/TD)
const UserTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  &:hover td {
    background-color: ${GRAY.LIGHT};
  }
`;

const TableData = styled.td<{ id: string; $index: number; $isLast?: boolean }>`
  padding: 10px;

  cursor: pointer;

  /* 마지막 컬럼이면 auto, 아니면 px 고정 */
  width: ${({ id, $isLast }) => ($isLast ? 'auto' : `${getColumnWidth(id)}px`)};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:first-child {
    border-left: none;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  /* 그냥 늘어날 수 있게, 필요한 경우 ellipsis 처리 */
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const ProfileImage = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 20%;
  overflow: hidden;
`;

// 이 예시에서는 실제 USER + "비고" 컬럼(REMARKS)까지 표시
type UserTableProps = {
  onClickHeader: (id: USER | MEMBER) => void;
  onClickUserItem: (userId: string) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

const UserTableView = ({
  onClickHeader,
  onClickUserItem,
  scrollRef,
  onScroll,
}: UserTableProps) => {
  const { height } = useWindowSize();

  const { users } = useSelector((state: RootState) => state.userFilter);
  const userTableHeaderItemList = useSelector(
    (state: RootState) => state.userFilter.userTableHeaderItemList
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...userTableHeaderItemList.filter((item) => item.isShown),
    BLANK_HEADER,
  ];

  // 각 TD에 들어갈 content
  const getUserTableContent = (id: string, user: User) => {
    switch (id) {
      case USER.NAME:
        return <MainText>{user?.name}</MainText>;
      case USER.MOBILE_PHONE:
        return <MainText>{user?.mobilePhone}</MainText>;
      case MEMBER.NAME:
        return (
          <ProfileContainer key={user.member.id}>
            <ProfileImage
              src={getRandomImage(user.member.id)}
              alt={MEMBER.PROFILE_IMAGE}
            />
            <MainText>{`${user.member?.name}`}</MainText>
          </ProfileContainer>
        );
      case BLANK:
        return <div></div>;
      default:
        return null;
    }
  };

  return (
    <>
      {/* 컨테이너: 항상 가로 100%, 필요하면 스크롤 */}
      <TableContainer ref={scrollRef} onScroll={onScroll} height={height}>
        <UserTable>
          <thead>
            <tr>
              {visibleColumns.map((item, index) => (
                <TableHeader
                  key={item.id}
                  id={item.id}
                  $isLast={index === visibleColumns.length - 1}
                >
                  {item.id !== BLANK && (
                    <UserTableHeader
                      item={{
                        ...item,
                        id: item.id as USER | MEMBER,
                      }}
                      onClick={onClickHeader}
                    />
                  )}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, rowIndex) => (
              <UserTableRow
                key={user.id}
                onClick={() => {
                  onClickUserItem(user.id);
                }}
              >
                {visibleColumns.map((item, index) => (
                  <TableData
                    key={item.id}
                    id={item.id}
                    $index={rowIndex}
                    $isLast={index === visibleColumns.length - 1}
                  >
                    <ContentWrapper>
                      {getUserTableContent(item.id, user)}
                    </ContentWrapper>
                  </TableData>
                ))}
              </UserTableRow>
            ))}
          </tbody>
        </UserTable>
      </TableContainer>
    </>
  );
};

export default UserTableView;
