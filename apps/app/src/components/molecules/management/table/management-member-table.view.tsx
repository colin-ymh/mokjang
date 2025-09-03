import React, { MutableRefObject } from 'react';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';

import { GRAY, MAIN, WHITE, YELLOW } from '@mokjang/constants';
import { MEMBER } from '@mokjang/constants';
import { MainText } from '@mokjang/components';
import { Member } from '@mokjang/models';
import useWindowSize from '../../../../hooks/window/window';
import { getFormattedMobilePhone } from '@mokjang/utils';
import { LOCALE } from '@mokjang/constants';
import ManagementMemberTableHeader from '../../../atoms/management/table/management-member-table-header';
import MemberProfilePopupButton from '../../common/button/member-profile-popup-button';
import { ORDER_DIRECTION } from '@mokjang/constants';
import { CHURCH_CONTENT_ID } from '../../../../constants/layout/content';
import { useManagementHeaderBarItems } from '../../../../hooks/layout/header-bar-items';
import { MainTag } from '@mokjang/components';
import { useI18n } from '../../../../../locales/client';
import { Ministry } from '@mokjang/models';
import { DropdownValueType } from '../../../atoms/common/dropdown/dropdown-item';
import Dropdown from '../../../atoms/common/dropdown/dropdown';
import TagDropdownButton from '../../../atoms/common/dropdown/tag-dropdown-button';
import { getTranslatedAge } from '@mokjang/utils';
import { getAge, getDateFromDateString } from '@mokjang/utils';

const getColumnWidth = (id: string) => {
  switch (id) {
    case MEMBER.GROUP:
      return 100;
    case MEMBER.NAME:
      return 150;
    case MEMBER.OFFICER:
      return 100;
    case MEMBER.MINISTRIES:
      return 100;
    case MEMBER.AGE:
      return 100;
    case MEMBER.MOBILE_PHONE:
      return 150;
    default:
      return 50;
  }
};

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  width: 100%;
`;

const MinistryContainer = styled.div`
  display: flex;
  position: relative;
`;

// 2. 테이블 컨테이너 (100% 폭 + 스크롤)
const TableContainer = styled.div<{ height: number }>`
  /* 항상 가로 100%를 채움 */
  width: 100%;
  background-color: ${WHITE};
  // /* 세로 높이만큼 상하 스크롤 */
  //min-height: 500px;
  max-height: ${({ height }) => `${height - 280}px`};

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
  padding: 20px;
  position: sticky;
  top: 0;
  z-index: 100;
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
    height: 1px;
    background: ${GRAY.LIGHT};
  }
`;

// 5. 본문(TR/TD)
const MemberTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  &:hover td {
    background-color: ${GRAY.SUPER_LIGHT};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableData = styled.td<{ id: string; $index: number; $isLast?: boolean }>`
  padding: 20px;

  cursor: pointer;

  /* 마지막 컬럼이면 auto, 아니면 px 고정 */
  width: ${({ id, $isLast }) => ($isLast ? 'auto' : `${getColumnWidth(id)}px`)};

  white-space: nowrap;
  text-overflow: ellipsis;

  overflow: visible; // 드롭다운이 셀을 넘어서도 보이게

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
  //overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type MemberTableProps = {
  members: Member[];
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
  orderBy: MEMBER | null;
  orderDirection: ORDER_DIRECTION | null;
  onClickHeaderItem: (headerId: MEMBER) => void;
  type: CHURCH_CONTENT_ID;
  leaderMemberId?: string;
  ministries?: Ministry[];
  onChangeMinistry?: (ministryId: string, member: Member) => void;
};

const ManagementMemberTableView = ({
  members,
  scrollRef,
  onScroll,
  orderBy,
  orderDirection,
  onClickHeaderItem,
  type,
  leaderMemberId,
  ministries = [],
  onChangeMinistry,
}: MemberTableProps) => {
  const { height } = useWindowSize();
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;
  const t = useI18n();
  const headerItems = useManagementHeaderBarItems(type);

  const ministryDropdownItems: DropdownValueType[] = [
    {
      value: undefined,
      title: t('none'),
    },
    ...ministries.map((ministry) => ({
      value: ministry.id,
      title: ministry.name,
    })),
  ];

  const getMemberTableContent = (id: MEMBER, member: Member) => {
    switch (id) {
      case MEMBER.GROUP:
        return <MainText>{member?.group?.name}</MainText>;

      case MEMBER.NAME:
        return (
          <ProfileContainer>
            <MemberProfilePopupButton member={member} isOfficerShown={false} />
            {member.id === leaderMemberId && (
              <MainTag
                title={
                  type === CHURCH_CONTENT_ID.GROUP
                    ? t('groupLeader')
                    : t('ministryGroupLeader')
                }
                color={YELLOW.DARK}
                backgroundColor={YELLOW.LIGHT}
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
      case MEMBER.MINISTRIES:
        return (
          <MinistryContainer>
            <Dropdown
              value={member?.ministries ? member.ministries[0]?.id : undefined}
              items={ministryDropdownItems}
              onChangeItem={(value) =>
                onChangeMinistry && onChangeMinistry(value, member)
              }
              CustomDropdownButton={(props) => (
                <TagDropdownButton {...props} color={MAIN.DEFAULT} />
              )}
              height={30}
            />
          </MinistryContainer>
        );
      case MEMBER.AGE:
        return (
          <MainText>
            {member.birth &&
              getTranslatedAge(
                basePath,
                getAge(getDateFromDateString(member.birth))
              )}
          </MainText>
        );
      case MEMBER.OFFICER:
        return <MainText>{member.officer?.name}</MainText>;
      default:
        return null;
    }
  };

  return (
    <TableContainer
      ref={scrollRef}
      onScroll={onScroll}
      height={onChangeMinistry ? height - 150 : height}
    >
      <MemberTable>
        <thead>
          <tr>
            {headerItems
              .filter((item) => item.isShown)
              .map((item) => (
                <TableHeader key={item.id} id={item.id}>
                  <ManagementMemberTableHeader
                    item={item}
                    onClick={onClickHeaderItem}
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                  />
                </TableHeader>
              ))}
          </tr>
        </thead>
        <tbody>
          {members.map((member, rowIndex) => (
            <MemberTableRow key={member.id}>
              {headerItems
                .filter((item) => item.isShown)
                .map((item, index) => (
                  <TableData
                    key={item.id}
                    id={item.id}
                    $index={rowIndex}
                    $isLast={index === headerItems.length - 1}
                  >
                    <ContentWrapper>
                      {getMemberTableContent(item.id as MEMBER, member)}
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
