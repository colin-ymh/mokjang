import React, { MutableRefObject } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

import {
  BLANK,
  CHURCH_USER_ROLE,
  GRAY,
  GREEN,
  RED,
  WHITE,
} from '../../../../../../../packages/constants/src';
import {
  MainTag,
  MainText,
} from '../../../../../../../packages/components/src';
import useWindowSize from '../../../../hooks/window/window';
import ChurchUserTableHeader from '../../../atoms/church-user/list/church-user-table-header';
import { BLANK_HEADER } from '../../../../redux/reducers/filter/member-filter-reducer';
import { ChurchUser } from '@mokjang/models';
import { CHURCH_USER, LOCALE } from '@mokjang/constants';
import MemberProfile from '../../../atoms/member/member-profile';
import { useI18n } from '../../../../../locales/client';
import { getTranslatedDateFromDateString } from '@mokjang/utils';
import { usePathname } from 'next/navigation';
import { getPermissionScopeTitle } from '@/utils/permission'; // 1. 컬럼별 PX 폭

// 1. 컬럼별 PX 폭
const getColumnWidth = (id: string) => {
  switch (id) {
    case CHURCH_USER.MEMBER:
      return 20;
    case CHURCH_USER.PERMISSION_TEMPLATE:
      return 20;
    case CHURCH_USER.PERMISSION_SCOPE:
      return 20;
    case CHURCH_USER.JOINED_AT:
      return 20;
    case CHURCH_USER.PERMISSION_ACTIVE:
      return 10;
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
  height: ${({ height }) => `${height - 280}px`};

  /* 오버플로 시 스크롤 */
  overflow-x: auto;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  background-color: ${WHITE};
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
  padding: 10px;
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: ${WHITE};

  /* 만약 마지막 컬럼이면 width: auto */
  width: ${({ id, $isLast }) => ($isLast ? 'auto' : `${getColumnWidth(id)}%`)};
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
    background: ${GRAY.LIGHT};
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
  width: ${({ id, $isLast }) => ($isLast ? 'auto' : `${getColumnWidth(id)}%`)};

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

// 이 예시에서는 실제 CHURCH_USER + "비고" 컬럼(REMARKS)까지 표시
type UserTableProps = {
  onClickHeader: (id: CHURCH_USER) => void;
  onClickUserItem: (user: ChurchUser) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

const ChurchUserTableView = ({
  onClickHeader,
  onClickUserItem,
  scrollRef,
  onScroll,
}: UserTableProps) => {
  const t = useI18n();
  const { height } = useWindowSize();

  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const { churchUsers } = useSelector(
    (state: RootState) => state.churchUserFilter
  );
  const userTableHeaderItemList = useSelector(
    (state: RootState) => state.churchUserFilter.churchUserTableHeaderItemList
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...userTableHeaderItemList.filter((item) => item.isShown),
    BLANK_HEADER,
  ];

  // 각 TD에 들어갈 content
  const getUserTableContent = (id: string, churchUser: ChurchUser) => {
    switch (id) {
      case CHURCH_USER.MEMBER:
        return churchUser?.member ? (
          <MemberProfile member={churchUser?.member} />
        ) : (
          <MainText>{t('linkedMemberUndefined')}</MainText>
        );
      case CHURCH_USER.PERMISSION_TEMPLATE:
        return (
          <MainText>
            {churchUser.role === CHURCH_USER_ROLE.OWNER
              ? t(CHURCH_USER_ROLE.OWNER)
              : churchUser?.permissionTemplate?.title || t('none')}
          </MainText>
        );
      case CHURCH_USER.PERMISSION_SCOPE:
        return (
          <MainText>
            {churchUser.role === CHURCH_USER_ROLE.OWNER
              ? t('all')
              : getPermissionScopeTitle(t, churchUser.permissionScopes)}
          </MainText>
        );
      case CHURCH_USER.JOINED_AT:
        return (
          <MainText>
            {getTranslatedDateFromDateString(locale, churchUser.joinedAt)}
          </MainText>
        );
      case CHURCH_USER.PERMISSION_ACTIVE:
        const isActive = churchUser?.isPermissionActive;
        return (
          <MainTag
            title={isActive ? t('active') : t('inactive')}
            backgroundColor={isActive ? GREEN.LIGHT : RED.LIGHT}
            color={isActive ? GREEN.DARK : RED.DARK}
          />
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
                    <ChurchUserTableHeader
                      item={{
                        ...item,
                        id: item.id as CHURCH_USER,
                      }}
                      onClick={onClickHeader}
                    />
                  )}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {churchUsers.map((churchUser, rowIndex) => (
              <UserTableRow
                key={churchUser.id}
                onClick={() => {
                  onClickUserItem(churchUser);
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
                      {getUserTableContent(item.id, churchUser)}
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

export default ChurchUserTableView;
