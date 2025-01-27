import React, { MutableRefObject } from 'react';
import styled from 'styled-components';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import useWindowSize from '@/hooks/window/window';
import { Education, EducationTerm } from '@/models/management/management';
import {
  EDUCATION_TERM,
  TERM_TABLE_HEADER_ITEM,
} from '@/constants/management/education-term-column';
import TermTableHeader from '@/components/atoms/management/education/term-table-header';
import { getFormattedDate, getLocaleDateFromDashDate } from '@/utils/format';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: hidden;
`;

const TermTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* 테이블 레이아웃 고정 */
`;

const TableHeader = styled.th<{ id: EDUCATION_TERM }>`
  border-bottom: 1px solid ${GRAY.LIGHT};
  border-right: 1px solid ${GRAY.LIGHT};
  padding: 5px 10px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${({ id }) => getColumnWidth(id)}%;
`;

const Scroll = styled.div<{ height: number }>`
  width: auto;
  height: ${({ height }) => `${height - 200}px`};
  overflow-y: auto;
  position: relative;
  //text-overflow: ellipsis; /* 넘치는 텍스트 ... 처리 */
  //white-space: nowrap; /* 줄바꿈 방지 */
  //flex-shrink: 0; /* 자식 콘텐츠 크기와 관계없이 고정 */
`;

const TermTableRow = styled.tr`
  &:hover td {
    background-color: ${GRAY.LIGHT};
  }
`;

const TableData = styled.td<{ id: EDUCATION_TERM; $index: number }>`
  border-bottom: 1px solid ${GRAY.LIGHT};
  border-right: 1px solid ${GRAY.LIGHT};
  padding: 10px;
  background-color: ${({ $index }) =>
    $index % 2 === 0 ? WHITE : GRAY.SIDE_BAR};
  cursor: pointer;
  width: ${({ id }) => getColumnWidth(id)}%;
`;

const ContentWrapper = styled.div`
  max-width: 100%; /* 부모인 td의 너비에 맞춤 */
  overflow: hidden; /* 넘치는 내용 숨김 */
  text-overflow: ellipsis; /* 넘치는 텍스트 ... 처리 */
  white-space: nowrap; /* 줄바꿈 방지 */
`;

const getColumnWidth = (id: EDUCATION_TERM) => {
  switch (id) {
    case EDUCATION_TERM.TERM:
      return 5;
    case EDUCATION_TERM.EDUCATION:
      return 20;
    case EDUCATION_TERM.PERIOD:
      return 40;
    case EDUCATION_TERM.EDUCATION_ENROLLMENTS:
      return 5;
    case EDUCATION_TERM.INSTRUCTOR:
      return 20;
    case EDUCATION_TERM.NUMBER_OF_SESSION:
      return 10;
    default:
      return 0;
  }
};

export const TERM_TABLE_HEADER: TERM_TABLE_HEADER_ITEM[] = [
  {
    id: EDUCATION_TERM.TERM,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: EDUCATION_TERM.EDUCATION,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: EDUCATION_TERM.PERIOD,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: EDUCATION_TERM.EDUCATION_ENROLLMENTS,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: EDUCATION_TERM.INSTRUCTOR,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: EDUCATION_TERM.NUMBER_OF_SESSION,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
];

type TermTableProps = {
  terms: EducationTerm[];
  education: Education;
  onClickTerm: (term: EducationTerm) => void;
  onClickHeader: (id: EDUCATION_TERM) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

const TermTableView = ({
  terms,
  education,
  onClickTerm,
  onClickHeader,
  scrollRef,
  onScroll,
}: TermTableProps) => {
  const { height } = useWindowSize();
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  const getTermTableContent = (id: EDUCATION_TERM, term: EducationTerm) => {
    switch (id) {
      case EDUCATION_TERM.TERM:
        return <MainText>{term.term}</MainText>;
      case EDUCATION_TERM.EDUCATION:
        return <MainText>{education.name}</MainText>;
      case EDUCATION_TERM.PERIOD:
        return (
          <MainText>
            {`${getLocaleDateFromDashDate(basePath, getFormattedDate(term?.startDate))} - ${getLocaleDateFromDashDate(basePath, getFormattedDate(term?.startDate))}`}
          </MainText>
        );
      case EDUCATION_TERM.EDUCATION_ENROLLMENTS:
        return <MainText>{term?.enrollmentCount}</MainText>;
      case EDUCATION_TERM.INSTRUCTOR:
        return <MainText>{term?.instructor?.name}</MainText>;
      case EDUCATION_TERM.NUMBER_OF_SESSION:
        return <MainText></MainText>;
      default:
        return null;
    }
  };

  return (
    <TableContainer>
      <TermTable>
        <thead>
          <tr>
            {TERM_TABLE_HEADER.filter((item) => item.isShown).map((item) => (
              <TableHeader key={item.id} id={item.id}>
                <TermTableHeader item={item} onClick={onClickHeader} />
              </TableHeader>
            ))}
          </tr>
        </thead>
      </TermTable>

      <Scroll ref={scrollRef} onScroll={onScroll} height={height}>
        <TermTable>
          <tbody>
            {terms.map((term, index) => (
              <TermTableRow key={term.id} onClick={() => onClickTerm(term)}>
                {TERM_TABLE_HEADER.filter((item) => item.isShown).map(
                  (item) => (
                    <TableData key={item.id} id={item.id} $index={index}>
                      <ContentWrapper>
                        {getTermTableContent(item.id as EDUCATION_TERM, term)}
                      </ContentWrapper>
                    </TableData>
                  )
                )}
              </TermTableRow>
            ))}
          </tbody>
        </TermTable>
      </Scroll>
    </TableContainer>
  );
};

export default TermTableView;
