import React, { MutableRefObject } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, WHITE } from '@/constants/styles/color';
import { VISITATION } from '@/constants/column/visitation-column';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BLANK } from '@/constants/constant';
import { Visitation } from '@/models/visitation/visitation';
import useWindowSize from '@/hooks/window/window';
import VisitationTableHeader from '@/components/atoms/visitation/visitation-table-header';
import { BLANK_HEADER } from '@/redux/reducers/filter/member-filter-reducer';
import { useI18n } from '../../../../locales/client';
import { getFormattedDate } from '@/utils/format';
import { getStatusColor } from '@/utils/color';
import MemberProfile from '@/components/atoms/member/member-profile';

// 1. 컬럼별 PX 폭
const getColumnWidth = (id: string) => {
  switch (id) {
    case VISITATION.TITLE:
      return 200;
    case VISITATION.VISITED:
      return 200;
    case VISITATION.STATUS:
      return 150;
    case VISITATION.DATE:
      return 200;
    case VISITATION.IN_CHARGE:
      return 150;
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
const VisitationTableRow = styled.tr`
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

const MembersContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
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

const ProfileImage = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 20%;
  overflow: hidden;
`;

// 이 예시에서는 실제 VISITATION + "비고" 컬럼(REMARKS)까지 표시
type VisitationTableProps = {
  visitations: Visitation[];
  onClickHeader: (id: VISITATION) => void;
  onClickVisitationItem: (visitationId: string) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

const VisitationTableView = ({
  visitations,
  onClickHeader,
  onClickVisitationItem,
  scrollRef,
  onScroll,
}: VisitationTableProps) => {
  const t = useI18n();
  const { height } = useWindowSize();

  const visitationTableHeaderItemList = useSelector(
    (state: RootState) => state.visitationFilter.visitationTableHeaderItemList
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...visitationTableHeaderItemList.filter((item) => item.isShown),
    BLANK_HEADER,
  ];

  // 각 TD에 들어갈 content
  const getVisitationTableContent = (id: string, visitation: Visitation) => {
    switch (id) {
      case VISITATION.TITLE:
        return <MainText>{visitation?.title}</MainText>;
      case VISITATION.VISITED:
        return (
          <MembersContainer>
            {visitation.members?.map((member) => (
              <MemberProfile key={member.id} member={member} />
            ))}
          </MembersContainer>
        );
      case VISITATION.STATUS:
        return (
          <StatusContainer>
            <ColoredDot color={getStatusColor(visitation.status)} />
            <MainText>{t(visitation?.status)}</MainText>
          </StatusContainer>
        );
      case VISITATION.DATE:
        return (
          <MainText>
            {`${
              visitation.startDate && getFormattedDate(visitation.startDate)
            } - ${visitation.endDate && getFormattedDate(visitation.endDate)}`}
          </MainText>
        );
      case VISITATION.IN_CHARGE:
        return <MemberProfile member={visitation.inCharge} />;
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
                  $isLast={index === visibleColumns.length - 1}
                >
                  {item.id !== BLANK && (
                    <VisitationTableHeader
                      item={{
                        ...item,
                        id: item.id as VISITATION,
                      }}
                      onClick={onClickHeader}
                    />
                  )}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {visitations.map((visitation, rowIndex) => (
              <VisitationTableRow
                key={visitation.id}
                onClick={() => {
                  onClickVisitationItem(visitation.id);
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
                      {getVisitationTableContent(item.id, visitation)}
                    </ContentWrapper>
                  </TableData>
                ))}
              </VisitationTableRow>
            ))}
          </tbody>
        </VisitationTable>
      </TableContainer>
    </>
  );
};

export default VisitationTableView;
