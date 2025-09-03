import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

import { Svg } from '@mokjang/assets';
import { GRAY, GREEN, MAIN, ORANGE, WHITE } from '@mokjang/constants';
import { Education, EducationSession, EducationTerm } from '@mokjang/models';
import { EDUCATION, EDUCATION_TERM } from '@mokjang/constants';
import EducationTermTableHeader from '../../../atoms/education/education-term/education-term-table-header';

import { SvgIcon } from '@mokjang/components';
import { getDateFromDateString, getDateStringFromDate } from '@mokjang/utils';
import { MainTag } from '@mokjang/components';
import {
  getStatusBackgroundColor,
  getStatusFontColor,
} from '../../../../utils/color';
import { MainText } from '@mokjang/components';
import {
  getTranslatedCompletedEnrollmentStatus,
  getTranslatedTerm,
} from '@mokjang/utils';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@mokjang/constants';
import { SIZE } from '@mokjang/constants';
import { useI18n } from '../../../../../locales/client';

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

const Chevron = styled(Svg.ChevronLeft)<{
  $isOpened: boolean;
  color?: string;
  $reverseDirection?: boolean;
}>`
  width: 12px;
  height: 14px;
  stroke: ${({ color }) => color || GRAY.DEFAULT};
  stroke-width: 3px;
  transform: rotate(${({ $isOpened }) => ($isOpened ? '180deg' : '270deg')});
  transition: transform 0.2s ease;
  border-radius: 5px;
  padding: 5px;
  &:hover {
    background-color: ${GRAY.LIGHT};
  }
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
  openedTermIds: string[];
  onClickTermChevron: (value: EducationTerm) => void;
  onClickEducationTermItem: (education: Education, term: EducationTerm) => void;
  onClickEducationSessionItem: (
    education: Education,
    term: EducationTerm,
    session: EducationSession
  ) => void;
};

const EducationTermTableView = ({
  openedTermIds,
  onClickTermChevron,
  onClickEducationTermItem,
  onClickEducationSessionItem,
}: EducationTermTableProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );

  const { educationTermTableHeaderItemList } = useSelector(
    (state: RootState) => state.educationFilter
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...educationTermTableHeaderItemList.filter((item) => item.isShown),
  ];

  // 각 TD에 들어갈 content
  const getEducationTermTableContent = (
    id: string,
    educationTerm: EducationTerm
  ) => {
    switch (id) {
      case EDUCATION_TERM.NAME:
        return (
          <EducationNameContainer $level={0}>
            <Chevron
              $isOpened={openedTermIds.includes(educationTerm.id)}
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                onClickTermChevron(educationTerm);
              }}
              $reverseDirection
            />

            <SvgIcon
              svg={Svg.Calendar}
              size={16}
              color={GREEN.DEFAULT}
              width={2}
            />
            <TitleContainer>
              <MainText>{`${getTranslatedTerm(locale, educationTerm.term)}`}</MainText>
              <MainText size={SIZE.SMALL} color={GRAY.SEMI_DARK}>
                {`${getDateStringFromDate(getDateFromDateString(educationTerm.startDate))} - ${getDateStringFromDate(getDateFromDateString(educationTerm.endDate))}`}
              </MainText>
            </TitleContainer>
          </EducationNameContainer>
        );
      case EDUCATION_TERM.STATUS:
        return (
          <StatusContainer>
            <MainText size={SIZE.SMALL} color={GRAY.SEMI_DARK}>
              {getTranslatedCompletedEnrollmentStatus(
                locale,
                educationTerm.completedMembersCount,
                educationTerm.enrollmentsCount
              )}
            </MainText>
            <MainTag
              title={t(educationTerm.status)}
              color={getStatusFontColor(educationTerm.status)}
              backgroundColor={getStatusBackgroundColor(educationTerm.status)}
            />
          </StatusContainer>
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
      case EDUCATION_TERM.NAME:
        return (
          <EducationNameContainer $level={2}>
            <SvgIcon
              svg={Svg.Clock}
              size={16}
              color={ORANGE.DEFAULT}
              width={2}
            />
            <TitleContainer>
              <MainText>{`${session.session}${t('session')} ${session.title}`}</MainText>
              <MainText size={SIZE.SMALL} color={GRAY.SEMI_DARK}>
                {`${getDateStringFromDate(getDateFromDateString(session.startDate))} - ${getDateStringFromDate(getDateFromDateString(session.endDate))}`}
              </MainText>
            </TitleContainer>
          </EducationNameContainer>
        );
      case EDUCATION_TERM.STATUS:
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
                  <EducationTermTableHeader
                    item={{
                      ...item,
                      id: item.id as EDUCATION_TERM,
                    }}
                    onClick={() => {}}
                  />
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {targetEducation.educationTerms?.map((educationTerm) => (
              <React.Fragment key={educationTerm.id}>
                <EducationTableRow
                  onClick={() =>
                    onClickEducationTermItem(targetEducation, educationTerm)
                  }
                >
                  {visibleColumns.map((item, index) => (
                    <TableData
                      key={`${educationTerm.id}-${item.id}`}
                      id={item.id}
                      $isLast={index === visibleColumns.length - 1}
                    >
                      <ContentWrapper>
                        {getEducationTermTableContent(item.id, educationTerm)}
                      </ContentWrapper>
                    </TableData>
                  ))}
                </EducationTableRow>

                {/* 교육 회차 */}
                {openedTermIds.includes(educationTerm.id) &&
                  educationTerm.educationSessions?.map((educationSession) => (
                    <React.Fragment key={educationSession.id}>
                      <EducationTableRow
                        onClick={() =>
                          onClickEducationSessionItem(
                            targetEducation,
                            educationTerm,
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
              </React.Fragment>
            ))}
          </tbody>
        </EducationTermTable>
      </TableContainer>
    </>
  );
};

export default EducationTermTableView;
