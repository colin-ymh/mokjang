import React, { MutableRefObject } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BLANK } from '@/constants/constant';

import useWindowSize from '@/hooks/window/window';

import { BLANK_HEADER } from '@/redux/reducers/filter/member-filter-reducer';
import EducationTableHeader from '@/components/atoms/education/education/education-table-header';
import {
  Education,
  EducationSession,
  EducationTerm,
} from '@/models/education/education';
import { EDUCATION, EDUCATION_TERM } from '@/constants/column/education-column';
import { useI18n } from '../../../../../locales/client';
import { getFormattedDate } from '@/utils/format';
import MemberProfile from '@/components/atoms/member/member-profile';
import { Chevron } from '@/components/atoms/common/dropdown/dropdown-chevron';

// 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)
const getColumnWidth = (id: string) => {
  switch (id) {
    case EDUCATION.NAME:
      return 300;
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
const EducationTable = styled.table`
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
  padding: 20px 10px;
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
    background: ${GRAY.LIGHT};
  }
`;

// 5. 본문(TR/TD)
const EducationTableRow = styled.tr`
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

const EducationNameContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  padding-left: 40px;
`;

type EducationTableProps = {
  openedEducationIds: string[];
  openedTermIds: string[];
  onClickEducationChevron: (id: string) => void;
  onClickTermChevron: (termId: string) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

const EducationTableView = ({
  openedEducationIds,
  openedTermIds,
  onClickEducationChevron,
  onClickTermChevron,
  scrollRef,
  onScroll,
}: EducationTableProps) => {
  const t = useI18n();
  const { height } = useWindowSize();

  const { educations, educationTableHeaderItemList } = useSelector(
    (state: RootState) => state.educationFilter
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...educationTableHeaderItemList.filter((item) => item.isShown),
    BLANK_HEADER,
  ];

  // 각 TD에 들어갈 content
  const getEducationTableContent = (id: string, education: Education) => {
    switch (id) {
      case EDUCATION.NAME:
        return (
          <EducationNameContainer>
            <Chevron
              $isOpened={openedEducationIds.includes(education.id)}
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                onClickEducationChevron(education.id);
              }}
              $reverseDirection
            />
            <MainText>{`${education.name}`}</MainText>
            {/*<StatusContainer>*/}
            {/*  <ColoredDot color={getStatusColor(education.status)} />*/}
            {/*  <MainText>{t(education?.status)}</MainText>*/}
            {/*</StatusContainer>*/}
          </EducationNameContainer>
        );

      default:
        return null;
    }
  };

  // 각 TD에 들어갈 content
  const getEducationTermTableContent = (
    id: string,
    educationTerm: EducationTerm
  ) => {
    switch (id) {
      case EDUCATION_TERM.TERM:
        return (
          <EducationNameContainer>
            <Chevron
              $isOpened={openedTermIds.includes(educationTerm.id)}
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                onClickTermChevron(educationTerm.id);
              }}
            />
            <MainText>{`${educationTerm.educationName} ${educationTerm?.term}기`}</MainText>
          </EducationNameContainer>
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
          <EducationNameContainer>
            <MainText>{`${session.session}${t('session')}`}</MainText>
            <MainText>{session.title}</MainText>
          </EducationNameContainer>
        );
      case EDUCATION_TERM.PERIOD:
        return (
          <MainText>
            {`${session.startDate && getFormattedDate(session.startDate)} - ${
              session.endDate && getFormattedDate(session.endDate)
            }`}
          </MainText>
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
        <EducationTable>
          <thead>
            <tr>
              {visibleColumns.map((item, index) => (
                <TableHeader
                  key={item.id}
                  id={item.id}
                  $isLast={index === visibleColumns.length - 1}
                >
                  {item.id !== BLANK && (
                    <EducationTableHeader
                      item={{
                        ...item,
                        id: item.id as EDUCATION,
                      }}
                      onClick={() => {}}
                    />
                  )}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {educations.map((education, rowIndex) => (
              <React.Fragment key={education.id}>
                {/* ① Term Row */}
                <EducationTableRow>
                  {visibleColumns.map((item, index) => (
                    <TableData
                      key={`${education.id}-${item.id}`}
                      id={item.id}
                      $index={rowIndex}
                      $isLast={index === visibleColumns.length - 1}
                    >
                      <ContentWrapper>
                        {getEducationTableContent(item.id, education)}
                      </ContentWrapper>
                    </TableData>
                  ))}
                </EducationTableRow>
                {education.educationTerms?.map((educationTerm) => (
                  <React.Fragment key={educationTerm.id}>
                    {/* ① Term Row */}
                    <EducationTableRow>
                      {visibleColumns.map((item, index) => (
                        <TableData
                          key={`${educationTerm.id}-${item.id}`}
                          id={item.id}
                          $index={rowIndex}
                          $isLast={index === visibleColumns.length - 1}
                        >
                          <ContentWrapper>
                            {getEducationTermTableContent(
                              item.id,
                              educationTerm
                            )}
                          </ContentWrapper>
                        </TableData>
                      ))}
                    </EducationTableRow>

                    {/* ② 세션 Row (열린 상태일 때만) */}
                    {openedTermIds.includes(educationTerm.id) &&
                      educationTerm.educationSessions?.map((session) => (
                        <EducationTableRow key={session.id}>
                          {visibleColumns.map((item, index) => (
                            <TableData
                              key={`${session.id}-${item.id}`}
                              id={item.id}
                              $index={rowIndex}
                              $isLast={index === visibleColumns.length - 1}
                            >
                              {getEducationSessionTableContent(
                                item.id,
                                session
                              )}
                            </TableData>
                          ))}
                        </EducationTableRow>
                      ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </EducationTable>
      </TableContainer>
    </>
  );
};

export default EducationTableView;
