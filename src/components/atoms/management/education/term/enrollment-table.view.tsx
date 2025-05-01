import React, { MutableRefObject } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import useWindowSize from '@/hooks/window/window';
import {
  DEFAULT_SESSION_ATTENDANCE,
  EducationEnrollment,
  SessionAttendance,
} from '@/models/management/management';
import EnrollmentTableHeader from '@/components/atoms/management/education/term/enrollment-table-header';
import {
  EDUCATION_ENROLLMENT,
  ENROLLMENT_TABLE_HEADER_ITEM,
} from '@/constants/management/education-term-column';
import { getAge, getDateFromString } from '@/utils/date';
import { getFormattedMobilePhone } from '@/utils/format';
import CheckButton from '@/components/atoms/common/button/check-button';
import { MEMBER } from '@/constants/member/member-column';
import { EDUCATION_STATUS } from '@/constants/constant';
import Button from '@/components/atoms/common/button/button';
import { useI18n } from '../../../../../../locales/client';
import { getRandomImage } from '@/utils/image';

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: hidden;
  position: relative;
`;

const EnrollmentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* 테이블 레이아웃 고정 */
`;

const TableHeader = styled.th<{ id: EDUCATION_ENROLLMENT }>`
  border-bottom: 1px solid ${GRAY.SEMI_LIGHT};
  border-right: 1px solid ${GRAY.SEMI_LIGHT};
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
  height: ${({ height }) => `${height - 500}px`};
  overflow-y: auto;
  position: relative;
  //text-overflow: ellipsis; /* 넘치는 텍스트 ... 처리 */
  //white-space: nowrap; /* 줄바꿈 방지 */
  //flex-shrink: 0; /* 자식 콘텐츠 크기와 관계없이 고정 */
`;

const EnrollmentTableRow = styled.tr`
  &:hover td {
    //background-color: ${GRAY.SEMI_LIGHT};
  }
`;

const TableData = styled.td<{ id: EDUCATION_ENROLLMENT; $index: number }>`
  border-bottom: 1px solid ${GRAY.SEMI_LIGHT};
  border-right: 1px solid ${GRAY.SEMI_LIGHT};
  padding: 10px;
  background-color: ${({ $index }) => ($index % 2 === 0 ? WHITE : GRAY.LIGHT)};
  cursor: pointer;
  width: ${({ id }) => getColumnWidth(id)}%;
`;

const ContentWrapper = styled.div`
  max-width: 100%; /* 부모인 td의 너비에 맞춤 */
  overflow: hidden; /* 넘치는 내용 숨김 */
  text-overflow: ellipsis; /* 넘치는 텍스트 ... 처리 */
  white-space: nowrap; /* 줄바꿈 방지 */
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const ProfileImage = styled(Image)`
  width: 35px;
  height: 35px;
  border-radius: 20%;
  overflow: hidden;
`;

const PopupButtonContainer = styled.div<{ $isShown: boolean }>`
  position: absolute;
  bottom: 100px;
  left: 50%; /* 부모의 왼쪽 기준 50% */
  justify-content: center; /* 내부 요소들 중앙 정렬(버튼 여러 개라면 유용) */

  /* 트랜지션 효과 */
  transition: opacity 0.2s ease;
  transform: translateX(-50%); /* 가로축 가운데 정렬 */
  /* display: none 대신, opacity와 pointer-events로 show/hide */
  opacity: ${({ $isShown }) => ($isShown ? 1 : 0)};
  pointer-events: ${({ $isShown }) => ($isShown ? 'auto' : 'none')};
`;

const getColumnWidth = (id: EDUCATION_ENROLLMENT) => {
  switch (id) {
    case EDUCATION_ENROLLMENT.CHECK:
      return 2;
    case EDUCATION_ENROLLMENT.ATTENDANCE:
      return 5;
    case EDUCATION_ENROLLMENT.MEMBER_NAME:
      return 10;
    case EDUCATION_ENROLLMENT.AGE:
      return 5;
    case EDUCATION_ENROLLMENT.GROUP:
      return 10;
    case EDUCATION_ENROLLMENT.STATUS:
      return 5;
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
    id: EDUCATION_ENROLLMENT.CHECK,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
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
    id: EDUCATION_ENROLLMENT.MOBILE_PHONE,
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
    id: EDUCATION_ENROLLMENT.ATTENDANCE,
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
  attendance: SessionAttendance[];
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  isInformation: boolean;
  checkedMemberIds: string[];
  onClickEnrollment: (enrollment: EducationEnrollment) => void;
  onClickHeader: (id: EDUCATION_ENROLLMENT) => void;
  onScroll: () => void;
  onChangeStatus: (
    termId: string,
    enrollmentId: string,
    status: EDUCATION_STATUS
  ) => void;
  onChangeAttendance: (
    termId: string,
    attendanceId: string,
    isPresent: boolean
  ) => void;
  onClickCheckAll: () => void;
  onClickCheckMember: (memberId: string) => void;
  onClickDeleteMembers: () => void;
};

const EnrollmentTableView = ({
  enrollments,
  attendance,
  scrollRef,
  isInformation,
  checkedMemberIds,
  onClickEnrollment,
  onClickHeader,
  onScroll,
  onChangeStatus,
  onChangeAttendance,
  onClickCheckAll,
  onClickCheckMember,
  onClickDeleteMembers,
}: EnrollmentTableProps) => {
  const t = useI18n();
  const { height } = useWindowSize();

  // isInformation에 따라 ATTENDANCE 열 숨기기
  const filteredTermTableHeader = isInformation
    ? TERM_TABLE_HEADER.filter(
        (item) => item.id !== EDUCATION_ENROLLMENT.ATTENDANCE
      )
    : TERM_TABLE_HEADER.filter(
        (item) => item.id !== EDUCATION_ENROLLMENT.STATUS
      );

  const getEnrollmentTableContent = (
    id: EDUCATION_ENROLLMENT,
    enrollment: EducationEnrollment,
    attendanceValue: SessionAttendance = DEFAULT_SESSION_ATTENDANCE
  ) => {
    switch (id) {
      case EDUCATION_ENROLLMENT.CHECK:
        return (
          <CheckButton
            value={checkedMemberIds.includes(enrollment.id)}
            onChange={() => onClickCheckMember(enrollment.id)}
          />
        );
      case EDUCATION_ENROLLMENT.STATUS:
        return (
          <CheckButton
            value={enrollment.status === EDUCATION_STATUS.COMPLETED}
            onChange={(value) => {
              onChangeStatus(
                enrollment.educationTermId,
                enrollment.id,
                value ? EDUCATION_STATUS.COMPLETED : EDUCATION_STATUS.INCOMPLETE
              );
            }}
          />
        );
      case EDUCATION_ENROLLMENT.ATTENDANCE:
        return (
          <CheckButton
            value={attendanceValue.isPresent}
            onChange={(value) => {
              onChangeAttendance(
                enrollment.educationTermId,
                attendanceValue.id,
                value
              );
            }}
          />
        );
      case EDUCATION_ENROLLMENT.MEMBER_NAME:
        return (
          <ProfileContainer>
            <ProfileImage
              src={
                enrollment.member?.profileImage ||
                getRandomImage(enrollment.member.id)
              }
              alt={MEMBER.PROFILE_IMAGE}
            />
            <MainText>{enrollment.member.name}</MainText>
          </ProfileContainer>
        );
      case EDUCATION_ENROLLMENT.AGE:
        return (
          <MainText>
            {enrollment.member?.birth &&
              getAge(getDateFromString(enrollment.member?.birth))}
          </MainText>
        );
      case EDUCATION_ENROLLMENT.GROUP:
        return <MainText>{enrollment.member?.group?.name}</MainText>;
      case EDUCATION_ENROLLMENT.NOTE:
        return <MainText>{enrollment?.note}</MainText>;
      case EDUCATION_ENROLLMENT.MOBILE_PHONE:
        return (
          <MainText>
            {enrollment?.member?.mobilePhone &&
              getFormattedMobilePhone(enrollment.member.mobilePhone)}
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
                <EnrollmentTableHeader
                  item={item}
                  onClick={onClickHeader}
                  isCheckAll={enrollments.length === checkedMemberIds.length}
                  onClickCheckAll={onClickCheckAll}
                />
              </TableHeader>
            ))}
          </tr>
        </thead>
      </EnrollmentTable>

      <Scroll ref={scrollRef} onScroll={onScroll} height={height}>
        <EnrollmentTable>
          <tbody>
            {enrollments
              .filter((enrollment) => !!enrollment.member)
              .map((enrollment, index) => (
                <EnrollmentTableRow
                  key={enrollment.id}
                  onClick={() => onClickEnrollment(enrollment)}
                >
                  {filteredTermTableHeader.map((item) => (
                    <TableData key={item.id} id={item.id} $index={index}>
                      <ContentWrapper>
                        {getEnrollmentTableContent(
                          item.id as EDUCATION_ENROLLMENT,
                          enrollment,
                          // 해당 등록에 맞는 출석부 불러오기
                          attendance.find(
                            (attd) =>
                              attd.educationEnrollmentId === enrollment.id
                          )
                        )}
                      </ContentWrapper>
                    </TableData>
                  ))}
                </EnrollmentTableRow>
              ))}
          </tbody>
        </EnrollmentTable>
      </Scroll>
      <PopupButtonContainer $isShown={checkedMemberIds.length > 0}>
        <Button
          text={t('button.delete')}
          width={100}
          height={30}
          onClick={onClickDeleteMembers}
        />
      </PopupButtonContainer>
    </TableContainer>
  );
};

export default EnrollmentTableView;
