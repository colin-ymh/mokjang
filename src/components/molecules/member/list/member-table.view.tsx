import React, { MutableRefObject } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MEMBER } from '@/constants/member/member-column';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BAPTISM, GENDER } from '@/constants/constant';
import { getAge, getDateFromString } from '@/utils/date';
import {
  getFormattedDate,
  getFormattedHomePhone,
  getFormattedMobilePhone,
  getLocaleDateFromDashDate,
} from '@/utils/format';
import { Member } from '@/models/member/member';
import MemberTableHeader from '@/components/atoms/member/list/member-table-header';
import useWindowSize from '@/hooks/window/window';
import { LOCALE } from '@/constants/state/locale';

import DefaultImage from '../../../../../public/png/default-member-image.png';
import { useI18n } from '../../../../../locales/client';
import CheckButton from '@/components/atoms/common/button/check-button';

const getColumnWidth = (id: string) => {
  switch (id) {
    case MEMBER.CHECK:
      return 10;
    case MEMBER.GROUP:
      return 40;
    case MEMBER.NAME:
      return 100;
    case MEMBER.GENDER:
      return 40;
    case MEMBER.OFFICER:
      return 40;
    case MEMBER.AGE:
      return 40;
    case MEMBER.MOBILE_PHONE:
      return 150;
    case MEMBER.HOME_PHONE:
      return 140;
    case MEMBER.ADDRESS:
      return 150;
    case MEMBER.OCCUPATION:
      return 80;
    case MEMBER.SCHOOL:
      return 100;
    case MEMBER.BAPTISM:
      return 50;
    case MEMBER.BIRTH:
      return 150;
    case MEMBER.REGISTERED_AT:
      return 150;
    case MEMBER.UPDATED_AT:
      return 150;
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
  border-top: 1px solid ${GRAY.LIGHT};
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
  z-index: 10;
  width: ${({ id }) => `${getColumnWidth(id)}px`};
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
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
  overflow: hidden;
`;

type MemberTableProps = {
  members: Member[];
  checkedMemberIds: string[];
  onClickHeader: (id: MEMBER) => void;
  onClickMemberItem: (memberId: string) => void;
  onClickCheckMember: (memberId: string) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

const MemberTableView = ({
  members,
  checkedMemberIds,
  onClickHeader,
  onClickMemberItem,
  onClickCheckMember,
  scrollRef,
  onScroll,
}: MemberTableProps) => {
  const { height } = useWindowSize();
  const memberTableHeaderItemList = useSelector(
    (state: RootState) => state.memberFilter.memberTableHeaderItemList
  );
  const t = useI18n();
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  const getMemberTableContent = (id: MEMBER, member: Member) => {
    switch (id) {
      case MEMBER.CHECK:
        return (
          <CheckButton
            value={checkedMemberIds.includes(member.id)}
            onChange={() => onClickCheckMember(member.id)}
          />
        );

      case MEMBER.GROUP:
        return <MainText>{member?.group?.name}</MainText>;

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
          <MainText>{getFormattedMobilePhone(member?.mobilePhone)}</MainText>
        );
      case MEMBER.GENDER:
        return <MainText>{t(member.gender as GENDER)}</MainText>;
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
      case MEMBER.BAPTISM:
        return <MainText>{t(member?.baptism as BAPTISM)}</MainText>;
      case MEMBER.OFFICER:
        return <MainText>{member.officer?.name}</MainText>;
      case MEMBER.MINISTRIES:
        return (
          <MainText>
            {member.ministries?.map((item) => {
              return item.name;
            })}
          </MainText>
        );
      case MEMBER.EDUCATIONS:
        return (
          <MainText>
            {/*{member.educations?.map((education) => {*/}
            {/*  return education.educationTerm.educationName;*/}
            {/*})}*/}
          </MainText>
        );
      case MEMBER.HOME_PHONE:
        return (
          <MainText>
            {member.homePhone && getFormattedHomePhone(member.homePhone)}
          </MainText>
        );
      case MEMBER.ADDRESS:
        return <MainText>{member.address}</MainText>;
      case MEMBER.OCCUPATION:
        return <MainText>{member.occupation}</MainText>;
      case MEMBER.SCHOOL:
        return <MainText>{member.school}</MainText>;
      case MEMBER.MARRIAGE:
        return <MainText>{t(member.marriage)}</MainText>;
      case MEMBER.REGISTERED_AT:
        return (
          <MainText>
            {member.registeredAt &&
              getLocaleDateFromDashDate(
                basePath,
                getFormattedDate(member.registeredAt)
              )}
          </MainText>
        );
      case MEMBER.UPDATED_AT:
        return (
          <MainText>
            {member.updatedAt &&
              getLocaleDateFromDashDate(
                basePath,
                getFormattedDate(member.updatedAt)
              )}
          </MainText>
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
            {memberTableHeaderItemList
              .filter((item) => item.isShown)
              .map((item) => (
                <TableHeader key={item.id} id={item.id}>
                  <MemberTableHeader item={item} onClick={onClickHeader} />
                </TableHeader>
              ))}
          </tr>
        </thead>
      </MemberTable>

      <Scroll ref={scrollRef} onScroll={onScroll} height={height}>
        <MemberTable>
          <tbody>
            {members.map((member, index) => (
              <MemberTableRow
                key={member.id}
                onClick={() => onClickMemberItem(member.id)}
              >
                {memberTableHeaderItemList
                  .filter((item) => item.isShown)
                  .map((item) => (
                    <TableData key={item.id} id={item.id} $index={index}>
                      <ContentWrapper>
                        {getMemberTableContent(item.id, member)}
                      </ContentWrapper>
                    </TableData>
                  ))}
              </MemberTableRow>
            ))}
          </tbody>
        </MemberTable>
      </Scroll>
    </TableContainer>
  );
};

export default MemberTableView;
