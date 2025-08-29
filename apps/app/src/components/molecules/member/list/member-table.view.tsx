import React, { MutableRefObject } from 'react';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

import { GRAY, MAIN, PURPLE, WHITE } from '../../../../constants/styles/color';
import { MEMBER } from '../../../../constants/column/member-column';
import { MainText } from '../../../atoms/common/text/main-text';
import {
  BAPTISM,
  BLANK,
  GENDER,
  GROUP_ROLE,
  MINISTRY_GROUP_ROLE,
} from '../../../../constants/constant';
import { getAge, getDateFromInput } from '../../../../utils/date';
import {
  getFormattedDate,
  getFormattedHomePhone,
  getFormattedMobilePhone,
} from '../../../../utils/format';
import { Member } from '../../../../models/member/member';
import MemberTableHeader from '../../../atoms/member/list/member-table-header';
import useWindowSize from '../../../../hooks/window/window';
import { LOCALE } from '../../../../constants/state/locale';

import { useI18n } from '../../../../../locales/client';
import { BLANK_HEADER } from '../../../../redux/reducers/filter/member-filter-reducer';
import ProfileImage from '../../../atoms/common/image/profile-image';
import { getTranslatedDateFromDateString } from '../../../../utils/translate';
import MainTag from '../../../atoms/common/tag/main-tag';

// 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)
const getColumnWidth = (id: string) => {
  switch (id) {
    case MEMBER.CHECK:
      return 40;
    case MEMBER.GROUP:
      return 100;
    case MEMBER.NAME:
      return 150;
    case MEMBER.GENDER:
      return 100;
    case MEMBER.OFFICER:
      return 100;
    case MEMBER.AGE:
      return 100;
    case MEMBER.MOBILE_PHONE:
      return 100;
    case MEMBER.HOME_PHONE:
      return 100;
    case MEMBER.ADDRESS:
      return 300;
    case MEMBER.OCCUPATION:
      return 100;
    case MEMBER.SCHOOL:
      return 150;
    case MEMBER.BAPTISM:
      return 100;
    case MEMBER.BIRTH:
      return 200;
    case MEMBER.REGISTERED_AT:
      return 200;
    case MEMBER.UPDATED_AT:
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
  background-color: ${WHITE};
  /* 세로 높이만큼 상하 스크롤 */
  height: ${({ height }) => `${height - 180}px`};

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
const TableHeader = styled.th<{
  id: string;
  $isLast?: boolean;
  $isProfile?: boolean;
}>`
  padding: 20px;
  padding-left: ${({ $isProfile }) => $isProfile && '10px'};
  background-color: ${GRAY.SUPER_LIGHT};
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
    background: ${GRAY.LIGHT};
  }
`;

// 5. 본문(TR/TD)
const MemberTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  background-color: ${WHITE};
  &:hover td {
    background-color: ${GRAY.SUPER_LIGHT};
  }
`;

const TableData = styled.td<{ id: string; $index: number; $isLast?: boolean }>`
  padding: 15px 10px;
  justify-content: center;
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
  justify-content: center;
  /* 그냥 늘어날 수 있게, 필요한 경우 ellipsis 처리 */
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
`;

// 이 예시에서는 실제 MEMBER + "비고" 컬럼(REMARKS)까지 표시
type MemberTableProps = {
  members: Member[];
  onClickHeader: (id: MEMBER) => void;
  onClickMemberItem: (memberId: string) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

const MemberTableView = ({
  members,
  onClickHeader,
  onClickMemberItem,
  scrollRef,
  onScroll,
}: MemberTableProps) => {
  const { height } = useWindowSize();
  const t = useI18n();
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  const { filteredItems, memberTableHeaderItemList } = useSelector(
    (state: RootState) => state.memberFilter
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...memberTableHeaderItemList.filter((item) => item.isShown),
    BLANK_HEADER,
  ];

  // 각 TD에 들어갈 content
  const getMemberTableContent = (id: string, member: Member) => {
    switch (id) {
      case MEMBER.PROFILE_IMAGE:
        return <ProfileImage value={member?.profileImageUrl} />;
      case MEMBER.GROUP:
        return <MainText>{member?.group?.name}</MainText>;
      case MEMBER.NAME:
        return (
          <ProfileContainer>
            {/*<MemberProfile member={member} isProfileImageShown={false} /> */}
            <MainText>{member?.name}</MainText>
            {member.groupRole === GROUP_ROLE.LEADER && (
              <MainTag
                title={t('groupLeader')}
                color={MAIN.DARK}
                backgroundColor={MAIN.LIGHT}
              />
            )}
            {member.ministryGroupRole === MINISTRY_GROUP_ROLE.LEADER && (
              <MainTag
                title={t('ministryGroupLeader')}
                color={PURPLE.DARK}
                backgroundColor={PURPLE.LIGHT}
              />
            )}
          </ProfileContainer>
        );
      case MEMBER.MOBILE_PHONE:
        return (
          <MainText>
            {member?.mobilePhone && getFormattedMobilePhone(member.mobilePhone)}
          </MainText>
        );
      case MEMBER.GENDER:
        return <MainText>{t(member.gender as GENDER)}</MainText>;
      case MEMBER.BIRTH:
        return (
          <MainText>
            {member.birth &&
              getTranslatedDateFromDateString(
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
      case MEMBER.BAPTISM:
        return <MainText>{t(member?.baptism as BAPTISM)}</MainText>;
      case MEMBER.OFFICER:
        return <MainText>{member.officer?.name}</MainText>;
      case MEMBER.MINISTRIES:
        return (
          <MainText>
            {member.ministries?.map((item) => item.name).join(', ')}
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
      case MEMBER.REGISTERED_AT:
        return (
          <MainText>
            {member.registeredAt &&
              getTranslatedDateFromDateString(
                basePath,
                getFormattedDate(member.registeredAt)
              )}
          </MainText>
        );
      case MEMBER.UPDATED_AT:
        return (
          <MainText>
            {member.updatedAt &&
              getTranslatedDateFromDateString(
                basePath,
                getFormattedDate(member.updatedAt)
              )}
          </MainText>
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
      <TableContainer
        ref={scrollRef}
        onScroll={onScroll}
        height={filteredItems.length > 0 ? height - 45 : height}
      >
        <MemberTable>
          <thead>
            <tr>
              {visibleColumns.map((item, index) => (
                <TableHeader
                  key={item.id}
                  id={item.id}
                  $isLast={index === visibleColumns.length - 1}
                  $isProfile={item.id === MEMBER.NAME}
                >
                  {item.id !== BLANK && (
                    <MemberTableHeader
                      item={{
                        ...item,
                        id: item.id as MEMBER,
                      }}
                      onClick={onClickHeader}
                    />
                  )}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((member, rowIndex) => (
              <MemberTableRow
                key={member.id}
                onClick={() => onClickMemberItem(member.id)}
              >
                {visibleColumns.map((item, index) => (
                  <TableData
                    key={item.id}
                    id={item.id}
                    $index={rowIndex}
                    $isLast={index === visibleColumns.length - 1}
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
    </>
  );
};

export default MemberTableView;
