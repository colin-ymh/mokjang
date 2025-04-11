import React, { MutableRefObject } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MEMBER } from '@/constants/member/member-column';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BAPTISM, BLANK, GENDER } from '@/constants/constant';
import { getAge, getDateFromString } from '@/utils/date';
import {
  getFormattedDate,
  getFormattedHomePhone,
  getFormattedMobilePhone,
  getLocaleDateFromDashDate,
} from '@/utils/format';
import { Member } from '@/models/member/member';
import VisitationTableHeader from '@/components/atoms/member/list/member-table-header';
import useWindowSize from '@/hooks/window/window';
import { LOCALE } from '@/constants/state/locale';
import CheckButton from '@/components/atoms/common/button/check-button';
import Button from '@/components/atoms/common/button/button';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import { getRandomImage } from '@/utils/image';

import { BLANK_HEADER } from '@/redux/reducers/member-filter-reducer';
import { useI18n, useScopedI18n } from '../../../../locales/client';

// 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)
const getColumnWidth = (id: string) => {
  switch (id) {
    case MEMBER.CHECK:
      return 25;
    case MEMBER.GROUP:
      return 60;
    case MEMBER.NAME:
      return 120;
    case MEMBER.GENDER:
      return 60;
    case MEMBER.OFFICER:
      return 80;
    case MEMBER.AGE:
      return 50;
    case MEMBER.MOBILE_PHONE:
      return 140;
    case MEMBER.HOME_PHONE:
      return 140;
    case MEMBER.ADDRESS:
      return 180;
    case MEMBER.OCCUPATION:
      return 100;
    case MEMBER.SCHOOL:
      return 120;
    case MEMBER.BAPTISM:
      return 80;
    case MEMBER.BIRTH:
      return 120;
    case MEMBER.REGISTERED_AT:
      return 130;
    case MEMBER.UPDATED_AT:
      return 130;
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
  height: ${({ height }) => `${height - 200}px`};

  /* 오버플로 시 스크롤 */
  overflow-x: auto;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
`;

// 3. 테이블은 width: 100% + table-layout: fixed
const VisitationTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
  /* 아래 옵션으로 텍스트 줄바꿈 등 처리. 
       white-space: nowrap; 로 하면 줄바꿈 없이 가로로 늘어나게 됨 */
  white-space: normal;
`;

// 4. 헤더(TH)
const TableHeader = styled.th<{ id: string; isLast?: boolean }>`
  border-right: 1px solid ${GRAY.LIGHT};
  padding: 3px;
  background-color: ${GRAY.SIDE_BAR};
  position: sticky;
  top: 0;
  z-index: 5;

  /* 만약 마지막 컬럼이면 width: auto */
  width: ${({ id, isLast }) => (isLast ? 'auto' : `${getColumnWidth(id)}px`)};

  /* 텍스트 넘침 처리 */
  overflow: hidden;
  text-overflow: ellipsis;
`;

// 5. 본문(TR/TD)
const VisitationTableRow = styled.tr`
  &:hover td {
    background-color: ${GRAY.LIGHT};
  }
`;

const TableData = styled.td<{ id: string; $index: number; isLast?: boolean }>`
  border: 1px solid ${GRAY.LIGHT};
  padding: 3px;
  background-color: ${({ $index }) => ($index % 2 === 0 ? WHITE : WHITE)};
  cursor: pointer;

  /* 마지막 컬럼이면 auto, 아니면 px 고정 */
  width: ${({ id, isLast }) => (isLast ? 'auto' : `${getColumnWidth(id)}px`)};

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
  gap: 10px;
`;

const ProfileImage = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 20%;
  overflow: hidden;
`;

const PopupButtonContainer = styled.div<{ $isShown: boolean }>`
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  justify-content: center;
  transition: opacity 0.2s ease;

  opacity: ${({ $isShown }) => ($isShown ? 1 : 0)};
  pointer-events: ${({ $isShown }) => ($isShown ? 'auto' : 'none')};
`;

// 이 예시에서는 실제 MEMBER + "비고" 컬럼(REMARKS)까지 표시
type VisitationTableProps = {
  isPopupShown: boolean;
  onClickOpen: () => void;
  onClickClose: () => void;
  members: Member[];
  checkedMemberIds: string[];
  onClickHeader: (id: MEMBER) => void;
  onClickMemberItem: (memberId: string) => void;
  onClickCheckMember: (memberId: string) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onClickDeleteMembers: () => void;
};

const VisitationTableView = ({
  isPopupShown,
  onClickOpen,
  onClickClose,
  members,
  checkedMemberIds,
  onClickHeader,
  onClickMemberItem,
  onClickCheckMember,
  scrollRef,
  onScroll,
  onClickDeleteMembers,
}: VisitationTableProps) => {
  const { height } = useWindowSize();
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  const memberTableHeaderItemList = useSelector(
    (state: RootState) => state.memberFilter.memberTableHeaderItemList
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...memberTableHeaderItemList.filter((item) => item.isShown),
    BLANK_HEADER,
  ];

  // 각 TD에 들어갈 content
  const getVisitationTableContent = (id: string, member: Member) => {
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
              src={member.profileImage || getRandomImage(member.id)}
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
        <VisitationTable>
          <thead>
            <tr>
              {visibleColumns.map((item, index) => (
                <TableHeader
                  key={item.id}
                  id={item.id}
                  isLast={index === visibleColumns.length - 1}
                >
                  {item.id !== BLANK && (
                    <VisitationTableHeader
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
              <VisitationTableRow
                key={member.id}
                onClick={() => onClickMemberItem(member.id)}
              >
                {visibleColumns.map((item, index) => (
                  <TableData
                    key={item.id}
                    id={item.id}
                    $index={rowIndex}
                    isLast={index === visibleColumns.length - 1}
                  >
                    <ContentWrapper>
                      {getVisitationTableContent(item.id, member)}
                    </ContentWrapper>
                  </TableData>
                ))}
              </VisitationTableRow>
            ))}
          </tbody>
        </VisitationTable>
      </TableContainer>

      <PopupButtonContainer $isShown={checkedMemberIds.length > 0}>
        <Button
          text={t_button('delete')}
          width={120}
          height={40}
          onClick={onClickOpen}
          fontSize={16}
        />
      </PopupButtonContainer>

      <ConfirmPopup
        title={t_popup('deleteMemberTitle')}
        body={t_popup('deleteMemberBody')}
        buttonNum={2}
        isShow={isPopupShown}
        onClickLeftButton={onClickClose}
        onClickRightButton={onClickDeleteMembers}
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('delete')}
      />
    </>
  );
};

export default VisitationTableView;
