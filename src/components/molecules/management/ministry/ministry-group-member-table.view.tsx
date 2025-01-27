import React, { MutableRefObject } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { TABLE_HEADER_ITEM } from '@/redux/reducers/member-filter-reducer';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MEMBER } from '@/constants/member/member-column';
import MemberTableHeader from '@/components/atoms/member/list/member-table-header';
import { Member } from '@/models/member/member';
import useWindowSize from '@/hooks/window/window';
import { MainText } from '@/components/atoms/common/text/main-text';

import DefaultImage from '../../../../../public/png/default-member-image.png';
import {
  getFormattedDate,
  getFormattedMobilePhone,
  getLocaleDateFromDashDate,
} from '@/utils/format';
import { getAge, getDateFromString } from '@/utils/date';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';

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

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: hidden;
`;

const MemberTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* 테이블 레이아웃 고정 */
`;

const TableHeader = styled.th<{ id: string }>`
  border-bottom: 1px solid ${GRAY.LIGHT};
  border-right: 1px solid ${GRAY.LIGHT};
  padding: 5px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${({ id }) => {
    return `${getColumnWidth(id)}px`;
  }};
`;

const Scroll = styled.div<{ height: number }>`
  width: auto;
  height: ${({ height }) => `${height - 200}px`};
  overflow-y: auto;
  position: relative;
  text-overflow: ellipsis; /* 넘치는 텍스트 ... 처리 */
  white-space: nowrap; /* 줄바꿈 방지 */
  flex-shrink: 0; /* 자식 콘텐츠 크기와 관계없이 고정 */
`;

const MemberTableRow = styled.tr`
  &:hover td {
    background-color: ${GRAY.LIGHT};
  }
`;

const TableData = styled.td<{ id: string; $index: number }>`
  border-bottom: 1px solid ${GRAY.LIGHT};
  border-right: 1px solid ${GRAY.LIGHT};
  padding: 5px;
  background-color: ${({ $index }) =>
    $index % 2 === 0 ? WHITE : GRAY.SIDE_BAR};
  cursor: pointer;
  width: ${({ id }) => {
    return `${getColumnWidth(id)}px`;
  }};
`;

const ContentWrapper = styled.div`
  max-width: 100%; /* 부모인 td의 너비에 맞춤 */
  overflow: hidden; /* 넘치는 내용 숨김 */
  text-overflow: ellipsis; /* 넘치는 텍스트 ... 처리 */
  white-space: nowrap; /* 줄바꿈 방지 */
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const ProfileImage = styled(Image)`
  width: 35px;
  height: 35px;
  border-radius: 20%;
`;

export const GROUP_MEMBER_TABLE_HEADER: TABLE_HEADER_ITEM[] = [
  {
    id: MEMBER.GROUP,
    isShown: true,
    isSortable: true,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: MEMBER.OFFICER,
    isShown: true,
    isSortable: true,
    isFilterable: true,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.NAME,
    isShown: true,
    isSortable: true,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: MEMBER.AGE,
    isShown: true,
    isSortable: true,
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
  ministryGroupMembers: Member[];
  onClickHeader: (id: MEMBER) => void;
  // onClickMemberItem: (memberId: string) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

const MinistryMinistryGroupMemberTableView = ({
  ministryGroupMembers,
  onClickHeader,
  // onClickMemberItem,
  scrollRef,
  onScroll,
}: MemberTableProps) => {
  const { height } = useWindowSize();
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  const getMemberTableContent = (id: MEMBER, member: Member) => {
    switch (id) {
      case MEMBER.GROUP:
        return <MainText>{}</MainText>;

      case MEMBER.NAME:
        return (
          <ProfileContainer>
            <ProfileImage
              src={member.profileImage || DefaultImage}
              alt={MEMBER.PROFILE_IMAGE}
            />
            <MainText>{member.name}</MainText>
          </ProfileContainer>
        );
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
            {member.birth && getAge(getDateFromString(member.birth))}
          </MainText>
        );
      case MEMBER.OFFICER:
        return <MainText>{member.officer?.name}</MainText>;
      default:
        return null;
    }
  };

  return (
    <TableContainer>
      <MemberTable>
        <thead>
          <tr>
            {GROUP_MEMBER_TABLE_HEADER.filter((item) => item.isShown).map(
              (item) => (
                <TableHeader key={item.id} id={item.id}>
                  <MemberTableHeader item={item} onClick={onClickHeader} />
                </TableHeader>
              )
            )}
          </tr>
        </thead>
      </MemberTable>

      <Scroll ref={scrollRef} onScroll={onScroll} height={height}>
        <MemberTable>
          <tbody>
            {ministryGroupMembers?.map((member, index) => (
              <MemberTableRow
                key={member.id}
                // onClick={() => onClickMemberItem(member.id)}
              >
                {GROUP_MEMBER_TABLE_HEADER.filter((item) => item.isShown).map(
                  (item) => (
                    <TableData key={item.id} id={item.id} $index={index}>
                      <ContentWrapper>
                        {getMemberTableContent(item.id, member)}
                      </ContentWrapper>
                    </TableData>
                  )
                )}
              </MemberTableRow>
            ))}
          </tbody>
        </MemberTable>
      </Scroll>
    </TableContainer>
  );
};

export default MinistryMinistryGroupMemberTableView;
