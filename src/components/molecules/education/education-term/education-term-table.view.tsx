import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, WHITE } from '@/constants/styles/color';
import { BLANK } from '@/constants/constant';

import { BLANK_HEADER } from '@/redux/reducers/filter/member-filter-reducer';
import { EducationTerm } from '@/models/education/education';
import { EDUCATION, EDUCATION_TERM } from '@/constants/column/education-column';
import EducationTermTableHeader from '@/components/atoms/education/education-term/education-term-table-header';

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
const TableContainer = styled.div`
  /* 항상 가로 100%를 채움 */
  width: 100%;
  /* 세로 높이만큼 상하 스크롤 */
  min-height: 200px;
  max-height: 300px;

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

type EducationTermTableProps = {
  openedTermIds: string[];
  onClickTermChevron: (value: EducationTerm) => void;
};

const EducationTermTableView = ({
  openedTermIds,
  onClickTermChevron,
}: EducationTermTableProps) => {
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );

  const { educationTableHeaderItemList } = useSelector(
    (state: RootState) => state.educationFilter
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...educationTableHeaderItemList.filter((item) => item.isShown),
    BLANK_HEADER,
  ];

  return (
    <>
      {/* 컨테이너: 항상 가로 100%, 필요하면 스크롤 */}
      <TableContainer>
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
                      onClick={() => {}}
                    />
                  )}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {/*{targetEducation.educationTerms?.map((educationTerm) => (*/}
            {/*  <React.Fragment key={educationTerm.id}>*/}
            {/*    /!* 기수 *!/*/}
            {/*    <EducationTermTableItem*/}
            {/*      educationTerm={educationTerm}*/}
            {/*      onClickTermChevron={onClickTermChevron}*/}
            {/*      openedTermIds={openedTermIds}*/}
            {/*    />*/}

            {/*    /!* 회차 *!/*/}
            {/*    {openedTermIds.includes(educationTerm.id) &&*/}
            {/*      educationTerm.educationSessions?.map((session) => (*/}
            {/*        <EducationSessionTableItem educationSession={session} />*/}
            {/*      ))}*/}
            {/*  </React.Fragment>*/}
            {/*))}*/}
          </tbody>
        </EducationTermTable>
      </TableContainer>
    </>
  );
};

export default EducationTermTableView;
