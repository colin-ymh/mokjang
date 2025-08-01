import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, GREEN, RED, WHITE } from '@/constants/styles/color';
import { BLANK, GENDER } from '@/constants/constant';
import { EDUCATION_ATTENDANCE } from '@/constants/column/education-column';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getFormattedMobilePhone } from '@/utils/format';
import { EducationAttendance } from '@/models/education/education';
import { EDUCATION_ATTENDANCE_TABLE_HEADER_LIST } from '@/redux/reducers/filter/education-filter-reducer';
import { useI18n } from '../../../../../locales/client';
import MemberProfile from '@/components/atoms/member/member-profile';
import EducationAttendanceTableHeader from '@/components/atoms/education/education-session/education-attendance-table-header';
import { getAge, getDateFromDateString } from '@/utils/date';
import Button from '@/components/atoms/common/button/button';
import BorderInput from '@/components/atoms/common/input/border-input';

// 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)
const getColumnWidth = (id: string) => {
  switch (id) {
    case EDUCATION_ATTENDANCE.MEMBER_NAME:
      return 15;
    case EDUCATION_ATTENDANCE.AGE:
      return 5;
    case EDUCATION_ATTENDANCE.GENDER:
      return 5;
    case EDUCATION_ATTENDANCE.MOBILE_PHONE:
      return 15;
    case EDUCATION_ATTENDANCE.STATUS:
      return 15;
    case EDUCATION_ATTENDANCE.NOTE:
      return 15;
    // default:
    //   // 비고(REMARKS) 컬럼 등
    //   return 80;
  }
};

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  width: 100%;
`;

// 2. 테이블 컨테이너 (100% 폭 + 스크롤)
const TableContainer = styled.div`
  /* 항상 가로 100%를 채움 */
  width: 100%;
  background-color: ${WHITE};
  // /* 세로 높이만큼 상하 스크롤 */
  //min-height: 200px;
  //max-height: 300px;
  height: 600px;

  /* 오버플로 시 스크롤 */
  overflow-x: auto;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
`;

// 3. 테이블은 width: 100% + table-layout: fixed
const EducationEnrollmentTable = styled.table`
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
  padding: 20px;
  position: sticky;
  top: 0;
  z-index: 100;
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

// 5. 본문(TR/TD)
const MemberTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  &:hover td {
    background-color: ${GRAY.SUPER_LIGHT};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableData = styled.td<{ id: string; $isLast?: boolean }>`
  padding: 20px;

  cursor: pointer;

  /* 마지막 컬럼이면 auto, 아니면 px 고정 */
  width: ${({ id, $isLast }) => ($isLast ? 'auto' : `${getColumnWidth(id)}%`)};

  white-space: nowrap;
  text-overflow: ellipsis;

  overflow: visible; // 드롭다운이 셀을 넘어서도 보이게

  &:first-child {
    border-left: none;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* 그냥 늘어날 수 있게, 필요한 경우 ellipsis 처리 */
  max-width: 100%;
  //overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

type EducationEnrollmentTableProps = {
  onChangeStatus: (attendanceId: string, isPresent: boolean) => void;
  onChangeNote: (
    attendanceId: string,
    note: ChangeEvent<HTMLInputElement>
  ) => void;
};

const EducationAttendanceTableView = ({
  onChangeStatus,
  onChangeNote,
}: EducationEnrollmentTableProps) => {
  const t = useI18n();
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...EDUCATION_ATTENDANCE_TABLE_HEADER_LIST.filter((item) => item.isShown),
  ];

  const getMemberTableContent = (
    id: string,
    attendance: EducationAttendance
  ) => {
    switch (id) {
      case EDUCATION_ATTENDANCE.MEMBER_NAME:
        return (
          <ProfileContainer>
            <MemberProfile member={attendance.educationEnrollment.member} />
          </ProfileContainer>
        );
      case EDUCATION_ATTENDANCE.AGE:
        return (
          <MainText>
            {getAge(
              getDateFromDateString(attendance.educationEnrollment.member.birth)
            )}
          </MainText>
        );
      case EDUCATION_ATTENDANCE.GENDER:
        return (
          <MainText>
            {t(attendance.educationEnrollment.member?.gender as GENDER)}
          </MainText>
        );
      case EDUCATION_ATTENDANCE.MOBILE_PHONE:
        return (
          <MainText>
            {attendance.educationEnrollment.member?.mobilePhone &&
              getFormattedMobilePhone(
                attendance.educationEnrollment.member.mobilePhone
              )}
          </MainText>
        );
      case EDUCATION_ATTENDANCE.STATUS:
        const isPresent = attendance.isPresent;

        return (
          <StatusContainer>
            <Button
              text={t('present')}
              color={isPresent ? WHITE : GRAY.DARK}
              backgroundColor={isPresent ? GREEN.DEFAULT : GRAY.LIGHT}
              width={'auto'}
              onClick={() => onChangeStatus(attendance.id, true)}
            />
            <Button
              text={t('absent')}
              color={!isPresent ? WHITE : GRAY.DARK}
              backgroundColor={!isPresent ? RED.DEFAULT : GRAY.LIGHT}
              width={'auto'}
              onClick={() => onChangeStatus(attendance.id, false)}
            />
          </StatusContainer>
        );

      case EDUCATION_ATTENDANCE.NOTE:
        return (
          <BorderInput
            value={attendance.educationEnrollment.note}
            onChange={(event) => onChangeNote(attendance.id, event)}
            placeholder={t('placeholder.note')}
            height={30}
          />
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
      <TableContainer>
        <EducationEnrollmentTable>
          <thead>
            <tr>
              {visibleColumns.map((item, index) => (
                <TableHeader
                  key={item.id}
                  id={item.id}
                  $isLast={index === visibleColumns.length - 1}
                >
                  <EducationAttendanceTableHeader
                    item={{
                      ...item,
                      id: item.id as EDUCATION_ATTENDANCE,
                    }}
                    onClick={() => {}}
                  />
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {targetEducationSession.educationAttendances?.map(
              (educationAttendance) => (
                <React.Fragment key={educationAttendance.id}>
                  <MemberTableRow
                    key={educationAttendance.id}
                    // onClick={() => onClickMemberItem(member.id)}
                  >
                    {visibleColumns.map((item, index) => (
                      <TableData
                        key={item.id}
                        id={item.id}
                        $isLast={index === visibleColumns.length - 1}
                      >
                        <ContentWrapper>
                          {getMemberTableContent(item.id, educationAttendance)}
                        </ContentWrapper>
                      </TableData>
                    ))}
                  </MemberTableRow>
                </React.Fragment>
              )
            )}
          </tbody>
        </EducationEnrollmentTable>
      </TableContainer>
    </>
  );
};

export default EducationAttendanceTableView;
