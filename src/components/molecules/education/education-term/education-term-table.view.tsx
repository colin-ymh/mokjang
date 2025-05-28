import React, { MutableRefObject } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { BLACK, GRAY, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BLANK } from '@/constants/constant';

import useWindowSize from '@/hooks/window/window';

import { BLANK_HEADER } from '@/redux/reducers/filter/member-filter-reducer';
// import { getEducationTermStatusColor } from '@/utils/color';
import EducationTermTableHeader from '@/components/atoms/education/education-term/education-term-table-header';
import { EducationSession, EducationTerm } from '@/models/education/education';
import { EDUCATION_TERM } from '@/constants/education/education-column';
import { useI18n } from '../../../../../locales/client';
import ChevronDown from '../../../../../public/svg/chevron-down.svg';
import { getStatusColor } from '@/utils/color';
import { getFormattedDate } from '@/utils/format';
import Plus from '../../../../../public/svg/plus.svg';
import MemberProfile from '@/components/atoms/member/member-profile';

// 1. 컬럼별 PX 폭
const getColumnWidth = (id: string) => {
  switch (id) {
    case EDUCATION_TERM.TERM:
      return 300;
    case EDUCATION_TERM.STATUS:
      return 150;
    case EDUCATION_TERM.PERIOD:
      return 200;
    case EDUCATION_TERM.IN_CHARGE:
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
const EducationTermTable = styled.table`
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
const EducationTermTableRow = styled.tr`
  position: relative;
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  &:hover td {
    background-color: ${GRAY.LIGHT};
  }
`;

/* educationSession 전용 Row (optional) */
const EducationSessionTableRow = styled.tr`
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

const TermContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  position: relative;
`;

const Chevron = styled(ChevronDown)<{ $isOpened: boolean }>`
  width: 18px;
  height: 18px;
  stroke: ${BLACK};
  transform: rotate(${({ $isOpened }) => ($isOpened ? '180deg' : '0deg')});
  transition: transform 0.2s ease;
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

const SessionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 50px;
  gap: 10px;
`;

const PlusButton = styled(Plus)`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);

  stroke: ${BLACK};
  stroke-width: 1.5px;
  width: 25px;
  height: 25px;
  border-radius: 10%;
  cursor: pointer;

  &:hover {
    background-color: ${GRAY.DEFAULT};
  }
`;

type EducationTermTableProps = {
  openedTermId: string;
  educationTerms: EducationTerm[];
  onClickTermChevron: (termId: string) => void;
  onClickHeader: (id: EDUCATION_TERM) => void;
  onClickEducationTermItem: (
    educationId: string,
    educationTermId: string
  ) => void;
  onClickEducationSessionItem: (
    educationTermId: string,
    educationSessionId: string
  ) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onClickOpenAddEducationSession?: (educationTerm?: EducationTerm) => void;
};

const EducationTermTableView = ({
  openedTermId,
  educationTerms,
  onClickTermChevron,
  onClickHeader,
  onClickEducationTermItem,
  onClickEducationSessionItem,
  scrollRef,
  onScroll,
  onClickOpenAddEducationSession,
}: EducationTermTableProps) => {
  const t = useI18n();
  const { height } = useWindowSize();

  const educationTermTableHeaderItemList = useSelector(
    (state: RootState) =>
      state.educationTermFilter.educationTermTableHeaderItemList
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...educationTermTableHeaderItemList.filter((item) => item.isShown),
    BLANK_HEADER,
  ];

  // 각 TD에 들어갈 content
  const getEducationTermTableContent = (
    id: string,
    educationTerm: EducationTerm
  ) => {
    switch (id) {
      case EDUCATION_TERM.TERM:
        return (
          <TermContainer>
            <Chevron
              $isOpened={openedTermId === educationTerm.id}
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                onClickTermChevron(educationTerm.id);
              }}
            />
            <MainText>{`${educationTerm.educationName} ${educationTerm?.term}기`}</MainText>
          </TermContainer>
        );

      case EDUCATION_TERM.STATUS:
        return (
          <StatusContainer>
            <ColoredDot color={getStatusColor(educationTerm.status)} />
            <MainText>{t(educationTerm?.status)}</MainText>
          </StatusContainer>
        );
      case EDUCATION_TERM.PERIOD:
        return (
          <MainText>
            {`${
              educationTerm.startDate &&
              getFormattedDate(educationTerm.startDate)
            } - ${
              educationTerm.endDate && getFormattedDate(educationTerm.endDate)
            }`}
          </MainText>
        );
      case EDUCATION_TERM.IN_CHARGE:
        return <MemberProfile member={educationTerm.inCharge} />;
      case BLANK:
        return (
          <div>
            <PlusButton
              onClick={(event: any) => {
                event.stopPropagation();
                onClickOpenAddEducationSession &&
                  onClickOpenAddEducationSession(educationTerm);
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  /* educationSession 행에 들어갈 content */
  const getEducationSessionTableContent = (
    id: string,
    session: EducationSession
  ) => {
    // term 컬럼에 맞춰서 작성해야함
    switch (id) {
      case EDUCATION_TERM.TERM:
        return (
          <SessionContainer>
            <MainText>{`${session.session}${t('session')}`}</MainText>
            <MainText>{session.title}</MainText>
          </SessionContainer>
        );
      case EDUCATION_TERM.PERIOD:
        return (
          <MainText>
            {`${session.startDate && getFormattedDate(session.startDate)} - ${
              session.endDate && getFormattedDate(session.endDate)
            }`}
          </MainText>
        );
      case EDUCATION_TERM.STATUS:
        return (
          <StatusContainer>
            <ColoredDot color={getStatusColor(session.status)} />
            <MainText>{t(session?.status)}</MainText>
          </StatusContainer>
        );
      case EDUCATION_TERM.IN_CHARGE:
        return <MemberProfile member={session.inCharge} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* 컨테이너: 항상 가로 100%, 필요하면 스크롤 */}
      <TableContainer ref={scrollRef} onScroll={onScroll} height={height}>
        <EducationTermTable>
          <thead>
            <tr>
              {visibleColumns.map((item, index) => (
                <TableHeader
                  key={item.id}
                  id={item.id}
                  $isLast={index === visibleColumns.length - 1}
                >
                  {item.id !== BLANK && (
                    <EducationTermTableHeader
                      item={{
                        ...item,
                        id: item.id as EDUCATION_TERM,
                      }}
                      onClick={onClickHeader}
                    />
                  )}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {educationTerms.map((educationTerm, rowIndex) => (
              <React.Fragment key={educationTerm.id}>
                {/* ① Term Row */}
                <EducationTermTableRow
                  onClick={() => {
                    onClickEducationTermItem(
                      educationTerm.educationId,
                      educationTerm.id
                    );
                  }}
                >
                  {visibleColumns.map((item, index) => (
                    <TableData
                      key={`${educationTerm.id}-${item.id}`}
                      id={item.id}
                      $index={rowIndex}
                      $isLast={index === visibleColumns.length - 1}
                    >
                      <ContentWrapper>
                        {getEducationTermTableContent(item.id, educationTerm)}
                      </ContentWrapper>
                    </TableData>
                  ))}
                </EducationTermTableRow>

                {/* ② 세션 Row (열린 상태일 때만) */}
                {openedTermId === educationTerm.id &&
                  educationTerm.educationSessions?.map((session) => (
                    <EducationSessionTableRow
                      key={session.id}
                      onClick={() =>
                        onClickEducationSessionItem(
                          educationTerm.id,
                          session.id
                        )
                      }
                    >
                      {visibleColumns.map((item, index) => (
                        <TableData
                          key={`${session.id}-${item.id}`}
                          id={item.id}
                          $index={rowIndex}
                          $isLast={index === visibleColumns.length - 1}
                        >
                          {getEducationSessionTableContent(item.id, session)}
                        </TableData>
                      ))}
                    </EducationSessionTableRow>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </EducationTermTable>
      </TableContainer>
    </>
  );
};

export default EducationTermTableView;
