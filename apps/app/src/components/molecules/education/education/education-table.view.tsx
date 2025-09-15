import React, { MutableRefObject } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

import {
  EDUCATION,
  GRAY,
  GREEN,
  LOCALE,
  MAIN,
  ORANGE,
  SIZE,
  WHITE,
} from '@mokjang/constants';

import useWindowSize from '../../../../hooks/window/window';
import EducationTableHeader from '../../../atoms/education/education/education-table-header';
import { Education, EducationSession, EducationTerm } from '@mokjang/models';

import { MainTag, MainText, SvgIcon } from '@mokjang/components';
import { useI18n } from '../../../../../locales/client';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getTranslatedCompletedEnrollmentStatus,
  getTranslatedTerm,
  getTranslatedTermCount,
} from '@mokjang/utils';
import { usePathname } from 'next/navigation';

import { Svg } from '@mokjang/assets';
import {
  getStatusBackgroundColor,
  getStatusFontColor,
} from '../../../../utils/color';
import EmptyList from '@/components/atoms/common/image/empty-list'; // 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)

// 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)
const getColumnWidth = (id: string) => {
  switch (id) {
    case EDUCATION.NAME:
      return 80;
    case EDUCATION.STATUS:
      return 20;
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
  padding: 0 25px;
  height: 50px;
  flex-shrink: 0;
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
    height: 0.6px;
    background: ${GRAY.LIGHT};
  }
`;

const EducationTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  &:hover td {
    background-color: ${GRAY.SUPER_LIGHT};
  }
`;

const TableData = styled.td<{ id: string; $isLast?: boolean }>`
  padding: 0 25px;
  height: 60px;
  flex-shrink: 0;
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

// 변경
const ShowMoreTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  background-color: ${GRAY.SUPER_LIGHT};
  //box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.1);
  &:hover td {
    background-color: ${MAIN.EXTRA_LIGHT};
  }
`;

const ShowMoreCell = styled.td`
  padding: 0;
  width: 100%;
`;

const ShowMoreTerm = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 10px;
  cursor: pointer;
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
            <SvgIcon svg={Svg.Book} size={16} color={MAIN.DEFAULT} width={2} />
            <TitleContainer>
              <MainText>{education.name}</MainText>
              {education.descriptionSummary && (
                <MainText size={SIZE.SMALL} color={GRAY.SEMI_DARK}>
                  {education.descriptionSummary}
                </MainText>
              )}
            </TitleContainer>
          </EducationNameContainer>
        );
      case EDUCATION.STATUS:
        return (
          <StatusContainer>
            <MainText size={SIZE.SMALL} color={GRAY.SEMI_DARK}>
              {getTranslatedTermCount(locale, education.termsCount)}
            </MainText>
          </StatusContainer>
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
          <EducationNameContainer $level={3}>
            {/*<Chevron*/}
            {/*  $isOpened={openedTermIds.includes(educationTerm.id)}*/}
            {/*  onClick={(event: React.MouseEvent) => {*/}
            {/*    event.stopPropagation();*/}
            {/*    onClickTermChevron(educationTerm);*/}
            {/*  }}*/}
            {/*  $reverseDirection*/}
            {/*/>*/}

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
      case EDUCATION.STATUS:
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
      case EDUCATION.NAME:
        return (
          <EducationNameContainer $level={3}>
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
      case EDUCATION.STATUS:
        return (
          <StatusContainer>
            <MainTag
              title={t(session.status)}
              color={getStatusFontColor(session.status)}
              backgroundColor={getStatusBackgroundColor(session.status)}
            />
            <MainText size={SIZE.SMALL} color={GRAY.SEMI_DARK}></MainText>
          </StatusContainer>
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
                  <EducationTableHeader
                    item={{
                      ...item,
                      id: item.id as EDUCATION,
                    }}
                    onClick={() => {}}
                  />
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
                          )
                        )}
                    </React.Fragment>
                  ))}
                {/* 더보기 */}
                {openedEducationIds.includes(education.id) &&
                  education.termsCount >= 4 && (
                    <ShowMoreTableRow>
                      <ShowMoreCell colSpan={visibleColumns.length}>
                        <ShowMoreTerm
                          onClick={() => onClickEducationItem(education)}
                        >
                          <SvgIcon
                            svg={Svg.Plus}
                            color={MAIN.DEFAULT}
                            width={3}
                          />
                          <MainText color={MAIN.DEFAULT} fontWeight={500}>
                            {t('button.showMoreEducationTerm')}
                          </MainText>
                        </ShowMoreTerm>
                      </ShowMoreCell>
                    </ShowMoreTableRow>
                  )}
              </React.Fragment>
            ))}
          </tbody>
        </EducationTable>
        {educations.length === 0 && <EmptyList width={200} height={200} />}
      </TableContainer>
    </>
  );
};

export default EducationTableView;
