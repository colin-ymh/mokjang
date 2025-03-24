import React, { MutableRefObject } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import MemberTableHeader from '@/components/atoms/member/list/member-table-header';
import { MEMBER } from '@/constants/member/member-column';
import { FamilyMember } from '@/models/member/member';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getFormattedDate, getLocaleDateFromDashDate } from '@/utils/format';
import { getAge, getDateFromString } from '@/utils/date';
import { GRAY, WHITE } from '@/constants/styles/color';
import useWindowSize from '@/hooks/window/window';
import { LOCALE } from '@/constants/state/locale';
import { TABLE_HEADER_ITEM } from '@/redux/reducers/member-filter-reducer';
import { useI18n } from '../../../../../locales/client';
import { getRandomImage } from '@/utils/image';
import LastFamilyTableContent from '@/components/atoms/member/information/last-family-table-content';

const getColumnWidth = (id: string) => {
  switch (id) {
    case MEMBER.RELATION:
      return 10;
    case MEMBER.NAME:
      return 20;
    case MEMBER.OFFICER:
      return 20;
    case MEMBER.GROUP:
      return 20;
    case MEMBER.AGE:
      return 10;
    case MEMBER.MOBILE_PHONE:
      return 30;
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

const PhoneContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FAMILY_MEMBER_TABLE_HEADER: TABLE_HEADER_ITEM[] = [
  {
    id: MEMBER.RELATION,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: MEMBER.NAME,
    isShown: true,
    isSortable: false,
    isFilterable: true,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.AGE,
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
    id: MEMBER.GROUP,
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

type FamilyTableProps = {
  familyMembers: FamilyMember[];
  onClickHeader: (id: MEMBER) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onClickMember: (familyMemberId: string) => void;
  getOfficerTitle: (id: string) => string;
  getGroupTitle: (id: string) => string;
  onClickEdit: (member: FamilyMember) => void;
  onClickConfirmDelete: (memberId: string) => void;
};

const FamilyTableView = ({
  familyMembers,
  onClickHeader,
  scrollRef,
  onScroll,
  onClickMember,
  getOfficerTitle,
  getGroupTitle,
  onClickEdit,
  onClickConfirmDelete,
}: FamilyTableProps) => {
  const { height } = useWindowSize();
  const t = useI18n();
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  const getMemberTableContent = (id: MEMBER, member: FamilyMember) => {
    switch (id) {
      case MEMBER.RELATION:
        return <MainText>{t(member?.relation)}</MainText>;
      case MEMBER.GROUP:
        return (
          <MainText>
            {member.familyMember?.groupId &&
              getGroupTitle(member.familyMember.groupId)}
          </MainText>
        );
      case MEMBER.NAME:
        return (
          <ProfileContainer>
            <ProfileImage
              src={
                member.familyMember?.profileImage ||
                getRandomImage(member.familyMember.id)
              }
              alt={MEMBER.PROFILE_IMAGE}
            />
            <MainText>{member.familyMember?.name}</MainText>
          </ProfileContainer>
        );
      case MEMBER.BIRTH:
        return (
          <MainText>
            {member.familyMember.birth &&
              getLocaleDateFromDashDate(
                basePath,
                getFormattedDate(member.familyMember.birth)
              )}
          </MainText>
        );
      case MEMBER.AGE:
        return (
          <MainText>
            {member.familyMember?.birth &&
              getAge(getDateFromString(member.familyMember.birth))}
          </MainText>
        );
      case MEMBER.OFFICER:
        return (
          <MainText>
            {member.familyMember?.officerId &&
              getOfficerTitle(member.familyMember.officerId)}
          </MainText>
        );
      case MEMBER.MOBILE_PHONE:
        // 테이블 마지막 요소 -> 케밥 버튼과 팝업이 존재해 컴포넌트 분리
        return (
          <LastFamilyTableContent
            member={member}
            onClickEdit={onClickEdit}
            onClickConfirmDelete={onClickConfirmDelete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TableContainer>
      <MemberTable>
        <thead>
          <tr>
            {FAMILY_MEMBER_TABLE_HEADER.filter((item) => item.isShown).map(
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
            {familyMembers.map((member, index) => (
              <MemberTableRow
                key={member.familyMember?.id}
                onClick={() => onClickMember(member.familyMember.id)}
              >
                {FAMILY_MEMBER_TABLE_HEADER.filter((item) => item.isShown).map(
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

export default FamilyTableView;
