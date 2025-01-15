import React, { MutableRefObject } from 'react';
import styled from 'styled-components';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import useWindowSize from '@/hooks/window/window';
import { EducationEnrollment } from '@/models/management/management';

import EnrollmentTableHeader from '@/components/atoms/management/education/enrollment-table-header';
import {
  EDUCATION_ENROLLMENT,
  ENROLLMENT_TABLE_HEADER_ITEM,
} from '@/constants/management/education-term-column';
import { getAge, getDateFromString } from '@/utils/date';
import { getFormattedMobilePhone } from '@/utils/format';

import { useI18n } from '../../../../../locales/client';

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: hidden;
`;

const EnrollmentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* 테이블 레이아웃 고정 */
`;

const TableHeader = styled.th<{ id: EDUCATION_ENROLLMENT }>`
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

const EnrollmentTableRow = styled.tr`
  &:hover td {
    background-color: ${GRAY.LIGHT};
  }
`;

const TableData = styled.td<{ id: EDUCATION_ENROLLMENT; $index: number }>`
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

const getColumnWidth = (id: EDUCATION_ENROLLMENT) => {
  switch (id) {
    case EDUCATION_ENROLLMENT.MEMBER_NAME:
      return 5;
    case EDUCATION_ENROLLMENT.AGE:
      return 5;
    case EDUCATION_ENROLLMENT.GROUP:
      return 10;
    case EDUCATION_ENROLLMENT.STATUS:
      return 10;
    case EDUCATION_ENROLLMENT.NOTE:
      return 20;
    case EDUCATION_ENROLLMENT.MOBILE_PHONE:
      return 10;
    default:
      return 0;
  }
};

export const TERM_TABLE_HEADER: ENROLLMENT_TABLE_HEADER_ITEM[] = [
  {
    id: EDUCATION_ENROLLMENT.MEMBER_NAME,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: EDUCATION_ENROLLMENT.AGE,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: EDUCATION_ENROLLMENT.GROUP,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: EDUCATION_ENROLLMENT.STATUS,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: EDUCATION_ENROLLMENT.MOBILE_PHONE,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: EDUCATION_ENROLLMENT.NOTE,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
];

type EnrollmentTableProps = {
  enrollments: EducationEnrollment[];
  isInformation: boolean;
  onClickEnrollment: (enrollment: EducationEnrollment) => void;
  onClickHeader: (id: EDUCATION_ENROLLMENT) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

const EnrollmentTableView = ({
  enrollments,
  isInformation,
  onClickEnrollment,
  onClickHeader,
  scrollRef,
  onScroll,
}: EnrollmentTableProps) => {
  const t = useI18n();
  const { height } = useWindowSize();

  // isInformation에 따라 STATUS 열 숨기기
  const filteredTermTableHeader = isInformation
    ? TERM_TABLE_HEADER.filter(
        (item) => item.id !== EDUCATION_ENROLLMENT.STATUS
      )
    : TERM_TABLE_HEADER;

  const getEnrollmentTableContent = (
    id: EDUCATION_ENROLLMENT,
    enrollment: EducationEnrollment
  ) => {
    switch (id) {
      case EDUCATION_ENROLLMENT.MEMBER_NAME:
        return <MainText>{enrollment.memberName}</MainText>;
      case EDUCATION_ENROLLMENT.AGE:
        return (
          <MainText>
            {getAge(getDateFromString(enrollment.member.birth))}
          </MainText>
        );
      case EDUCATION_ENROLLMENT.GROUP:
        return (
          <MainText>
            {/* {getCurrentGroup(enrollment.member.group)?.groupName} */}
          </MainText>
        );
      case EDUCATION_ENROLLMENT.STATUS:
        return <MainText>{t(enrollment?.status)}</MainText>;
      case EDUCATION_ENROLLMENT.NOTE:
        return <MainText>{enrollment?.note}</MainText>;
      case EDUCATION_ENROLLMENT.MOBILE_PHONE:
        return (
          <MainText>
            {getFormattedMobilePhone(enrollment?.member.mobilePhone)}
          </MainText>
        );
      default:
        return null;
    }
  };

  return (
    <TableContainer>
      <EnrollmentTable>
        <thead>
          <tr>
            {filteredTermTableHeader.map((item) => (
              <TableHeader key={item.id} id={item.id}>
                <EnrollmentTableHeader item={item} onClick={onClickHeader} />
              </TableHeader>
            ))}
          </tr>
        </thead>
      </EnrollmentTable>

      <Scroll ref={scrollRef} onScroll={onScroll} height={height}>
        <EnrollmentTable>
          <tbody>
            {enrollments.map((enrollment, index) => (
              <EnrollmentTableRow
                key={enrollment.id}
                onClick={() => onClickEnrollment(enrollment)}
              >
                {filteredTermTableHeader.map((item) => (
                  <TableData key={item.id} id={item.id} $index={index}>
                    <ContentWrapper>
                      {getEnrollmentTableContent(
                        item.id as EDUCATION_ENROLLMENT,
                        enrollment
                      )}
                    </ContentWrapper>
                  </TableData>
                ))}
              </EnrollmentTableRow>
            ))}
          </tbody>
        </EnrollmentTable>
      </Scroll>
    </TableContainer>
  );
};

export default EnrollmentTableView;
