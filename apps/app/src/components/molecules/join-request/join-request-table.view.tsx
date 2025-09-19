import React, { MutableRefObject } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

import {
  BLANK,
  GRAY,
  GREEN,
  JOIN_REQUEST,
  LOCALE,
  RED,
  USER,
  WHITE,
} from '@mokjang/constants';

import { Button, CustomPopup, MainText } from '@mokjang/components';

import useWindowSize from '../../../hooks/window/window';
import { BLANK_HEADER } from '../../../redux/reducers/filter/member-filter-reducer';
import { useI18n, useScopedI18n } from '../../../../locales/client';
import {
  getFormattedPhone,
  getTranslatedDateFromDateString,
} from '@mokjang/utils';
import { getStatusColor } from '../../../utils/color';
import { JoinRequest, Member } from '@mokjang/models';
import JoinRequestTableHeader from '../../atoms/join-request/join-request-table-header';
import LinkMemberUser from './link-member-user';
import { usePathname } from 'next/navigation';
import EmptyList from '@/components/atoms/common/image/empty-list'; // 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)

// 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)
const getColumnWidth = (id: string) => {
  switch (id) {
    case JOIN_REQUEST.NAME:
      return 300;
    case JOIN_REQUEST.MOBILE_PHONE:
      return 300;
    case JOIN_REQUEST.STATUS:
      return 150;
    case JOIN_REQUEST.CREATED_AT:
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
  height: ${({ height }) => `${height - 230}px`};

  /* 오버플로 시 스크롤 */
  overflow-x: auto;
  overflow-y: auto;

  display: flex;
  flex-direction: column;

  background-color: ${WHITE};
`;

// 3. 테이블은 width: 100% + table-layout: fixed
const JoinRequestTable = styled.table`
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
}>`
  padding: 0 25px;
  height: 50px;
  flex-shrink: 0;
  background-color: ${WHITE};
  position: sticky;
  top: 0;
  z-index: 5;

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
const JoinRequestTableRow = styled.tr`
  position: relative;
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  &:hover td {
    background-color: ${GRAY.SUPER_LIGHT};
  }
`;

const TableData = styled.td<{ id: string; $index: number; $isLast?: boolean }>`
  padding: 0 25px;
  height: 60px;
  flex-shrink: 0;

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

const StatusContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
`;

const ColoredDot = styled.div<{ color: string }>`
  display: flex;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: ${({ color }) => color};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  position: absolute;
  right: 20px;
`;

type JoinRequestTableProps = {
  isLinkPopupShown: boolean;
  joinRequests: JoinRequest[];
  onClickHeader: (id: JOIN_REQUEST | USER) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onClickOpenLink: (target: JoinRequest) => void;
  onClickApprove: () => void;
  onClickCancelLink: () => void;
  onClickReject: (joinId: string) => void;
  onChangeLinkMember: (member: Member) => void;
};

const JoinRequestTableView = ({
  isLinkPopupShown,
  joinRequests,
  onClickHeader,
  scrollRef,
  onScroll,
  onClickOpenLink,
  onClickApprove,
  onClickCancelLink,
  onClickReject,
  onChangeLinkMember,
}: JoinRequestTableProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const t_title = useScopedI18n('title');
  const t_button = useScopedI18n('button');
  const { height } = useWindowSize();

  const joinRequestTableHeaderItemList = useSelector(
    (state: RootState) => state.joinRequestFilter.joinRequestTableHeaderItemList
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...joinRequestTableHeaderItemList.filter((item) => item.isShown),
    BLANK_HEADER,
  ];

  // 각 TD에 들어갈 content
  const getJoinRequestTableContent = (id: string, joinRequest: JoinRequest) => {
    switch (id) {
      case JOIN_REQUEST.NAME:
        return <MainText>{joinRequest?.user.name}</MainText>;
      case JOIN_REQUEST.MOBILE_PHONE:
        return (
          <MainText>
            {getFormattedPhone(joinRequest?.user.mobilePhone)}
          </MainText>
        );
      case JOIN_REQUEST.STATUS:
        return (
          <StatusContainer>
            <ColoredDot color={getStatusColor(joinRequest.status)} />
            <MainText>{t(joinRequest?.status)}</MainText>
          </StatusContainer>
        );
      case JOIN_REQUEST.CREATED_AT:
        return (
          <MainText>
            {getTranslatedDateFromDateString(locale, joinRequest.createdAt)}
          </MainText>
        );
      case BLANK:
        return (
          <ButtonContainer>
            <Button
              text={t('button.approve')}
              width={50}
              height={30}
              backgroundColor={WHITE}
              borderColor={GREEN.LIGHT}
              color={GREEN.DEFAULT}
              onClick={() => onClickOpenLink(joinRequest)}
            />
            <Button
              text={t('button.reject')}
              width={50}
              height={30}
              backgroundColor={WHITE}
              borderColor={RED.LIGHT}
              color={RED.DEFAULT}
              onClick={() => onClickReject(joinRequest.id)}
            />
          </ButtonContainer>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 컨테이너: 항상 가로 100%, 필요하면 스크롤 */}
      <TableContainer ref={scrollRef} onScroll={onScroll} height={height}>
        <JoinRequestTable>
          <thead>
            <tr>
              {visibleColumns.map((item, index) => (
                <TableHeader
                  key={item.id}
                  id={item.id}
                  $isLast={index === visibleColumns.length - 1}
                >
                  {item.id !== BLANK && (
                    <JoinRequestTableHeader
                      item={{
                        ...item,
                        id: item.id as JOIN_REQUEST,
                      }}
                      onClick={onClickHeader}
                    />
                  )}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {joinRequests.map((joinRequest, rowIndex) => (
              <JoinRequestTableRow key={joinRequest.id}>
                {visibleColumns.map((item, index) => (
                  <TableData
                    key={item.id}
                    id={item.id}
                    $index={rowIndex}
                    $isLast={index === visibleColumns.length - 1}
                  >
                    <ContentWrapper>
                      {getJoinRequestTableContent(item.id, joinRequest)}
                    </ContentWrapper>
                  </TableData>
                ))}
              </JoinRequestTableRow>
            ))}
          </tbody>
        </JoinRequestTable>
        {joinRequests.length === 0 && <EmptyList width={200} height={200} />}

        <CustomPopup
          isShow={isLinkPopupShown}
          onClickClose={onClickCancelLink}
          onClickCancel={onClickCancelLink}
          width={500}
          height={850}
          headerTitle={t_title('linkMemberUser')}
          cancelText={t_button('cancel')}
          doneText={t_button('link')}
          onClickDone={onClickApprove}
        >
          <LinkMemberUser onChangeLinkMember={onChangeLinkMember} />
        </CustomPopup>
      </TableContainer>
    </>
  );
};

export default JoinRequestTableView;
