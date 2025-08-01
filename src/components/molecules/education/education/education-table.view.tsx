import React, { MutableRefObject } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { BLANK } from '@/constants/constant';

import useWindowSize from '@/hooks/window/window';

import { BLANK_HEADER } from '@/redux/reducers/filter/member-filter-reducer';
import EducationTableHeader from '@/components/atoms/education/education/education-table-header';
import {
  Education,
  EducationSession,
  EducationTerm,
} from '@/models/education/education';
import { EDUCATION } from '@/constants/column/education-column';
import ChevronLeft from '../../../../../public/svg/chevron-down.svg';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useI18n } from '../../../../../locales/client';
import { getTranslatedTerm } from '@/utils/translate';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';

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
    height: 0.6px;
    background: ${GRAY.LIGHT};
  }
`;

const EducationTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  &:hover td {
    background-color: ${MAIN.EXTRA_LIGHT};
  }
`;

const TableData = styled.td<{ id: string; $isLast?: boolean }>`
  padding: 20px;

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

const EducationNameContainer = styled.div<{ $level: number }>`
  display: flex;
  flex-direction: row;
  padding-left: ${({ $level }) => `${$level * 20}px`};
  align-items: center;
  gap: 10px;
`;

const Chevron = styled(ChevronLeft)<{
  $isOpened: boolean;
  color?: string;
  $reverseDirection?: boolean;
}>`
  width: 12px;
  height: 14px;
  stroke: ${({ color }) => color || GRAY.DEFAULT};
  stroke-width: 3px;
  transform: rotate(${({ $isOpened }) => ($isOpened ? '360deg' : '270deg')});
  transition: transform 0.2s ease;
`;

type EducationTableProps = {
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
  openedEducationIds: string[];
  openedTermIds: string[];
  onClickEducationChevron: (value: Education) => void;
  onClickTermChevron: (value: EducationTerm) => void;
  onClickEducationItem: (education: Education) => void;
  onClickEducationTermItem: (education: Education, term: EducationTerm) => void;
  onClickEducationSessionItem: (
    education: Education,
    term: EducationTerm,
    session: EducationSession
  ) => void;
};

const EducationTableView = ({
  scrollRef,
  onScroll,
  openedEducationIds,
  openedTermIds,
  onClickEducationChevron,
  onClickTermChevron,
  onClickEducationItem,
  onClickEducationTermItem,
  onClickEducationSessionItem,
}: EducationTableProps) => {
  const t = useI18n();
  const { height } = useWindowSize();

  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

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
          <EducationNameContainer $level={0}>
            <Chevron
              $isOpened={openedEducationIds.includes(education.id)}
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                onClickEducationChevron(education);
              }}
              $reverseDirection
            />
            <MainText>{`${education.name}`}</MainText>
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
      case EDUCATION.NAME:
        return (
          <EducationNameContainer $level={1}>
            <Chevron
              $isOpened={openedTermIds.includes(educationTerm.id)}
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                onClickTermChevron(educationTerm);
              }}
              $reverseDirection
            />
            <MainText>{`${getTranslatedTerm(locale, educationTerm.term)}`}</MainText>
          </EducationNameContainer>
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
      case EDUCATION.NAME:
        return (
          <EducationNameContainer $level={2}>
            <MainText>{`${session.session}${t('session')}`}</MainText>
            <MainText>{session.title}</MainText>
          </EducationNameContainer>
        );
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
            {/* 교육 */}
            {educations.map((education, rowIndex) => (
              <React.Fragment key={education.id}>
                <EducationTableRow
                  onClick={() => onClickEducationItem(education)}
                >
                  {visibleColumns.map((item, index) => (
                    <TableData
                      key={`${education.id}-${item.id}`}
                      id={item.id}
                      $isLast={index === visibleColumns.length - 1}
                    >
                      <ContentWrapper>
                        {getEducationTableContent(item.id, education)}
                      </ContentWrapper>
                    </TableData>
                  ))}
                </EducationTableRow>
                {/* 교육 기수 */}
                {openedEducationIds.includes(education.id) &&
                  education.educationTerms?.map((educationTerm) => (
                    <React.Fragment key={educationTerm.id}>
                      <EducationTableRow
                        onClick={() =>
                          onClickEducationTermItem(education, educationTerm)
                        }
                      >
                        {visibleColumns.map((item, index) => (
                          <TableData
                            key={`${educationTerm.id}-${item.id}`}
                            id={item.id}
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

                      {/* 교육 회차 */}
                      {openedTermIds.includes(educationTerm.id) &&
                        educationTerm.educationSessions?.map(
                          (educationSession) => (
                            <React.Fragment key={educationSession.id}>
                              <EducationTableRow
                                onClick={() =>
                                  onClickEducationSessionItem(
                                    education,
                                    educationTerm,
                                    educationSession
                                  )
                                }
                              >
                                {visibleColumns.map((item, index) => (
                                  <TableData
                                    key={`${educationSession.id}-${item.id}`}
                                    id={item.id}
                                    $isLast={
                                      index === visibleColumns.length - 1
                                    }
                                  >
                                    {getEducationSessionTableContent(
                                      item.id,
                                      educationSession
                                    )}
                                  </TableData>
                                ))}
                              </EducationTableRow>
                            </React.Fragment>
                          )
                        )}
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
