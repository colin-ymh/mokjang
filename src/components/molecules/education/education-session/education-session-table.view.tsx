import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, MAIN, ORANGE, WHITE } from '@/constants/styles/color';
import {
  Education,
  EducationSession,
  EducationTerm,
} from '@/models/education/education';
import {
  EDUCATION,
  EDUCATION_SESSION,
} from '@/constants/column/education-column';
import Clock from '../../../../../public/svg/clock.svg';
import SvgIcon from '@/components/atoms/common/icon/svg-icon';
import { getDateFromDateString, getDateStringFromDate } from '@/utils/date';
import MainTag from '@/components/atoms/common/tag/main-tag';
import { getStatusBackgroundColor, getStatusFontColor } from '@/utils/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import { SIZE } from '@/constants/styles/style';
import { useI18n } from '../../../../../locales/client';
import EducationSessionTableHeader from '@/components/atoms/education/education-session/education-session-table-header';

// 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)
const getColumnWidth = (id: string) => {
  switch (id) {
    case EDUCATION.NAME:
      return 70;
    case EDUCATION.STATUS:
      return 30;
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
  height: 100%;

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

const EducationTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  &:hover td {
    background-color: ${MAIN.EXTRA_LIGHT};
  }
`;

const TableData = styled.td<{ id: string; $isLast?: boolean }>`
  padding: 10px 15px;
  height: 30px;
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

const EducationNameContainer = styled.div<{ $level: number }>`
  display: flex;
  flex-direction: row;
  padding-left: ${({ $level }) => `${$level * 20}px`};
  align-items: center;
  gap: 20px;
  height: 40px;
  flex-shrink: 0;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

type EducationTermTableProps = {
  onClickEducationSessionItem: (
    education: Education,
    term: EducationTerm,
    session: EducationSession
  ) => void;
};

const EducationSessionTableView = ({
  onClickEducationSessionItem,
}: EducationTermTableProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );

  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );

  const { educationSessionTableHeaderItemList } = useSelector(
    (state: RootState) => state.educationFilter
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...educationSessionTableHeaderItemList.filter((item) => item.isShown),
  ];

  /* educationSession 행에 들어갈 content */
  const getEducationSessionTableContent = (
    id: string,
    session: EducationSession
  ) => {
    // term 컬럼에 맞춰서 작성해야함
    switch (id) {
      case EDUCATION_SESSION.NAME:
        return (
          <EducationNameContainer $level={0}>
            <SvgIcon svg={Clock} size={16} color={ORANGE.DEFAULT} width={2} />
            <TitleContainer>
              <MainText>{`${session.session}${t('session')} ${session.title}`}</MainText>
              <MainText size={SIZE.SMALL} color={GRAY.SEMI_DARK}>
                {`${getDateStringFromDate(getDateFromDateString(session.startDate))} - ${getDateStringFromDate(getDateFromDateString(session.endDate))}`}
              </MainText>
            </TitleContainer>
          </EducationNameContainer>
        );
      case EDUCATION_SESSION.STATUS:
        return (
          <StatusContainer>
            <MainText size={SIZE.SMALL} color={GRAY.SEMI_DARK}></MainText>
            <MainTag
              title={t(session.status)}
              color={getStatusFontColor(session.status)}
              backgroundColor={getStatusBackgroundColor(session.status)}
            />
          </StatusContainer>
        );
      default:
        return null;
    }
  };

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
                  <EducationSessionTableHeader
                    item={{
                      ...item,
                      id: item.id as EDUCATION_SESSION,
                    }}
                    onClick={() => {}}
                  />
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 교육 회차 */}
            {targetEducationTerm.educationSessions?.map((educationSession) => (
              <React.Fragment key={educationSession.id}>
                <EducationTableRow
                  onClick={() =>
                    onClickEducationSessionItem(
                      targetEducation,
                      targetEducationTerm,
                      educationSession
                    )
                  }
                >
                  {visibleColumns.map((item, index) => (
                    <TableData
                      key={`${educationSession.id}-${item.id}`}
                      id={item.id}
                      $isLast={index === visibleColumns.length - 1}
                    >
                      <ContentWrapper>
                        {getEducationSessionTableContent(
                          item.id,
                          educationSession
                        )}
                      </ContentWrapper>
                    </TableData>
                  ))}
                </EducationTableRow>
              </React.Fragment>
            ))}
          </tbody>
        </EducationTermTable>
      </TableContainer>
    </>
  );
};

export default EducationSessionTableView;
