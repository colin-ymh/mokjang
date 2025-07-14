import React, { MutableRefObject } from 'react';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { TABLE_HEADER_ITEM } from '@/redux/reducers/filter/member-filter-reducer';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MEMBER } from '@/constants/column/member-column';
import { MainText } from '@/components/atoms/common/text/main-text';
import { Member } from '@/models/member/member';
import useWindowSize from '@/hooks/window/window';
import { getAge, getDateFromInput } from '@/utils/date';
import {
  getFormattedDate,
  getFormattedMobilePhone,
  getLocaleDateFromDashDate,
} from '@/utils/format';
import { LOCALE } from '@/constants/state/locale';
import GroupMemberTableHeader from '@/components/atoms/management/group/member/group-member-table-header';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';

const getColumnWidth = (id: string) => {
  switch (id) {
    case MEMBER.GROUP:
      return 20;
    case MEMBER.NAME:
      return 20;
    case MEMBER.OFFICER:
      return 10;
    case MEMBER.AGE:
      return 10;
    case MEMBER.MOBILE_PHONE:
      return 40;
    default:
      return 50;
  }
};

// 2. 테이블 컨테이너 (100% 폭 + 스크롤)
const TableContainer = styled.div<{ height: number }>`
  /* 항상 가로 100%를 채움 */
  width: 100%;
  /* 세로 높이만큼 상하 스크롤 */
  height: ${({ height }) => `${height - 270}px`};

  /* 오버플로 시 스크롤 */
  overflow-x: auto;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
`;

// 3. 테이블은 width: 100% + table-layout: fixed
const MemberTable = styled.table`
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
  background-color: ${WHITE};
  position: sticky;
  top: 0;
  z-index: 5;

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
const MemberTableRow = styled.tr`
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

export const MANAGEMENT_MEMBER_TABLE_HEADER: TABLE_HEADER_ITEM[] = [
  {
    id: MEMBER.GROUP,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: MEMBER.OFFICER,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.NAME,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: MEMBER.AGE,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.MOBILE_PHONE,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: false,
    isDate: false,
  },
];

type MemberTableProps = {
  members: Member[];
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

const ManagementMemberTableView = ({
  members,
  scrollRef,
  onScroll,
}: MemberTableProps) => {
  const { height } = useWindowSize();
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  const getMemberTableContent = (id: MEMBER, member: Member) => {
    switch (id) {
      case MEMBER.GROUP:
        return <MainText>{member?.group?.name}</MainText>;

      case MEMBER.NAME:
        return <MemberProfilePopupButton member={member} />;
      case MEMBER.MOBILE_PHONE:
        return (
          <MainText>
            {member?.mobilePhone && getFormattedMobilePhone(member.mobilePhone)}
          </MainText>
        );
      case MEMBER.BIRTH:
        return (
          <MainText>
            {member.birth &&
              getLocaleDateFromDashDate(
                basePath,
                getFormattedDate(member.birth)
              )}
          </MainText>
        );
      case MEMBER.AGE:
        return (
          <MainText>
            {member.birth && getAge(getDateFromInput(member.birth))}
          </MainText>
        );
      case MEMBER.OFFICER:
        return <MainText>{member.officer?.name}</MainText>;
      default:
        return null;
    }
  };

  return (
    <TableContainer ref={scrollRef} onScroll={onScroll} height={height}>
      <MemberTable>
        <thead>
          <tr>
            {MANAGEMENT_MEMBER_TABLE_HEADER.filter((item) => item.isShown).map(
              (item) => (
                <TableHeader key={item.id} id={item.id}>
                  <GroupMemberTableHeader item={item} onClick={() => {}} />
                </TableHeader>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {members.map((member, rowIndex) => (
            <MemberTableRow key={member.id}>
              {MANAGEMENT_MEMBER_TABLE_HEADER.filter(
                (item) => item.isShown
              ).map((item, index) => (
                <TableData
                  key={item.id}
                  id={item.id}
                  $index={rowIndex}
                  $isLast={index === MANAGEMENT_MEMBER_TABLE_HEADER.length - 1}
                >
                  <ContentWrapper>
                    {getMemberTableContent(item.id, member)}
                  </ContentWrapper>
                </TableData>
              ))}
            </MemberTableRow>
          ))}
        </tbody>
      </MemberTable>
    </TableContainer>
  );
};

export default ManagementMemberTableView;
