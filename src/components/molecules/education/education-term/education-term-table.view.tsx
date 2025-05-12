import React, { MutableRefObject } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BLANK } from '@/constants/constant';

import useWindowSize from '@/hooks/window/window';

import { BLANK_HEADER } from '@/redux/reducers/member-filter-reducer';
// import { getEducationTermStatusColor } from '@/utils/color';
import EducationTermTableHeader from '@/components/atoms/education/education-term/education-term-table-header';
import { EducationTerm } from '@/models/education/education';
import { EDUCATION_TERM } from '@/constants/education/education-term-column';
import { useI18n } from '../../../../../locales/client';

// 1. 컬럼별 PX 폭
const getColumnWidth = (id: string) => {
  switch (id) {
    case EDUCATION_TERM.TERM:
      return 200;
    // case EDUCATION_TERM.STATUS:
    //   return 150;
    case EDUCATION_TERM.PERIOD:
      return 200;
    // case EDUCATION_TERM.INSTRUCTOR:
    //   return 150;
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
const TableHeader = styled.th<{ id: string; isLast?: boolean }>`
  padding: 3px 10px;
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: ${WHITE};

  /* 만약 마지막 컬럼이면 width: auto */
  width: ${({ id, isLast }) => (isLast ? 'auto' : `${getColumnWidth(id)}px`)};
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
    background: ${GRAY.DEFAULT};
  }
`;

// 5. 본문(TR/TD)
const EducationTermTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  &:hover td {
    background-color: ${GRAY.LIGHT};
  }
`;

const TableData = styled.td<{ id: string; $index: number; isLast?: boolean }>`
  padding: 10px;

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

const MembersContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
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

// 이 예시에서는 실제 EDUCATION_TERM + "비고" 컬럼(REMARKS)까지 표시
type EducationTermTableProps = {
  educationTerms: EducationTerm[];
  onClickHeader: (id: EDUCATION_TERM) => void;
  onClickEducationTermItem: (educationTermId: string) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

const EducationTermTableView = ({
  educationTerms,
  onClickHeader,
  onClickEducationTermItem,
  scrollRef,
  onScroll,
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
        return <MainText>{educationTerm?.term}</MainText>;

      // case EDUCATION_TERM.STATUS:
      //   return (
      //     <StatusContainer>
      //       <ColoredDot
      //         color={getEducationTermStatusColor(
      //           educationTerm.educationTermStatus
      //         )}
      //       />
      //       <MainText>{t(educationTerm?.educationTermStatus)}</MainText>
      //     </StatusContainer>
      //   );
      case EDUCATION_TERM.PERIOD:
        return (
          <MainText>
            {/*{educationTerm.educationTermStartDate &&*/}
            {/*  getFormattedDate(educationTerm.educationTermStartDate)}*/}
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
        <EducationTermTable>
          <thead>
            <tr>
              {visibleColumns.map((item, index) => (
                <TableHeader
                  key={item.id}
                  id={item.id}
                  isLast={index === visibleColumns.length - 1}
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
              <EducationTermTableRow
                key={educationTerm.id}
                onClick={() => {
                  onClickEducationTermItem(educationTerm.id);
                }}
              >
                {visibleColumns.map((item, index) => (
                  <TableData
                    key={item.id}
                    id={item.id}
                    $index={rowIndex}
                    isLast={index === visibleColumns.length - 1}
                  >
                    <ContentWrapper>
                      {getEducationTermTableContent(item.id, educationTerm)}
                    </ContentWrapper>
                  </TableData>
                ))}
              </EducationTermTableRow>
            ))}
          </tbody>
        </EducationTermTable>
      </TableContainer>
    </>
  );
};

export default EducationTermTableView;
