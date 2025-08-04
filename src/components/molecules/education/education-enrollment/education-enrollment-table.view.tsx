import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, GREEN, RED, WHITE } from '@/constants/styles/color';
import { BLANK } from '@/constants/constant';
import { EDUCATION_ENROLLMENT } from '@/constants/column/education-column';
import { EDUCATION_ENROLLMENT_STATUS } from '@/constants/status/status';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getFormattedMobilePhone } from '@/utils/format';
import { EducationEnrollment } from '@/models/education/education';
import { EDUCATION_ENROLLMENT_TABLE_HEADER_LIST } from '@/redux/reducers/filter/education-filter-reducer';
import { useI18n } from '../../../../../locales/client';
import EducationEnrollmentTableHeader from '@/components/atoms/education/education-term/education-enrollment-table-header';
import MemberProfile from '@/components/atoms/member/member-profile';
import TagDropdownButton from '@/components/atoms/common/dropdown/tag-dropdown-button';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import { useEducationEnrollmentStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { getStatusBackgroundColor, getStatusFontColor } from '@/utils/color';
import { SIZE } from '@/constants/styles/style';

// 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)
const getColumnWidth = (id: string) => {
  switch (id) {
    case EDUCATION_ENROLLMENT.MEMBER_NAME:
      return 20;
    case EDUCATION_ENROLLMENT.GROUP:
      return 10;
    case EDUCATION_ENROLLMENT.MOBILE_PHONE:
      return 20;
    case EDUCATION_ENROLLMENT.ATTENDANCE:
      return 20;
    case EDUCATION_ENROLLMENT.STATUS:
      return 20;
    default:
      // 비고(REMARKS) 컬럼 등
      return 0;
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
    height: 0.7px;
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
  justify-content: flex-start;
  /* 그냥 늘어날 수 있게, 필요한 경우 ellipsis 처리 */
  max-width: 100%;
  //overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusContainer = styled.div`
  display: flex;
  position: relative;
`;

const AttendanceContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
`;

const TotalBar = styled.div`
  display: flex;
  width: 80px;
  border-radius: 5px;
  height: 7px;
  background-color: ${GRAY.LIGHT};
  position: relative;
`;

const CountBar = styled.div<{ $count: number; max: number; color: string }>`
  width: ${({ $count, max }) => (max ? ($count / max) * 100 : 0)}%;
  border-radius: 5px;
  height: 7px;
  background-color: ${({ color }) => color};
  position: absolute;
  left: 0;
`;
type EducationEnrollmentTableProps = {
  onChangeStatus: (
    enrollmentId: string,
    status: EDUCATION_ENROLLMENT_STATUS
  ) => void;
};

const EducationEnrollmentTableView = ({
  onChangeStatus,
}: EducationEnrollmentTableProps) => {
  const t = useI18n();
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...EDUCATION_ENROLLMENT_TABLE_HEADER_LIST.filter((item) => item.isShown),
  ];

  const statusDropdownItems = useEducationEnrollmentStatusDropdownItems();

  const getMemberTableContent = (
    id: string,
    enrollment: EducationEnrollment
  ) => {
    switch (id) {
      case EDUCATION_ENROLLMENT.MEMBER_NAME:
        return (
          <ProfileContainer>
            <MemberProfile member={enrollment.member} />
          </ProfileContainer>
        );
      case EDUCATION_ENROLLMENT.GROUP:
        return <MainText>{enrollment.member?.group?.name}</MainText>;
      case EDUCATION_ENROLLMENT.MOBILE_PHONE:
        return (
          <MainText>
            {enrollment.member?.mobilePhone &&
              getFormattedMobilePhone(enrollment.member.mobilePhone)}
          </MainText>
        );
      case EDUCATION_ENROLLMENT.ATTENDANCE:
        return (
          <AttendanceContainer>
            <MainText
              size={SIZE.SMALL}
              color={GRAY.SEMI_DARK}
            >{`${enrollment.attendanceCount}/${targetEducationTerm.educationSessions.length}`}</MainText>
            <TotalBar>
              <CountBar
                $count={enrollment.attendanceCount}
                max={targetEducationTerm.educationSessions.length}
                color={
                  enrollment.attendanceCount ===
                  targetEducationTerm.educationSessions.length
                    ? GREEN.DEFAULT
                    : RED.DEFAULT
                }
              />
            </TotalBar>
          </AttendanceContainer>
        );
      case EDUCATION_ENROLLMENT.STATUS:
        return (
          <StatusContainer>
            <Dropdown
              value={enrollment.status}
              items={statusDropdownItems}
              onChangeItem={(value) => onChangeStatus(enrollment.id, value)}
              CustomDropdownButton={TagDropdownButton}
              backgroundColor={getStatusBackgroundColor(enrollment.status)}
              color={getStatusFontColor(enrollment.status)}
            />
          </StatusContainer>
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
                  <EducationEnrollmentTableHeader
                    item={{
                      ...item,
                      id: item.id as EDUCATION_ENROLLMENT,
                    }}
                    onClick={() => {}}
                  />
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {targetEducationTerm.educationEnrollments?.map(
              (educationEnrollment) => (
                <React.Fragment key={educationEnrollment.id}>
                  <MemberTableRow
                    key={educationEnrollment.id}
                    // onClick={() => onClickMemberItem(member.id)}
                  >
                    {visibleColumns.map((item, index) => (
                      <TableData
                        key={item.id}
                        id={item.id}
                        $isLast={index === visibleColumns.length - 1}
                      >
                        <ContentWrapper>
                          {getMemberTableContent(item.id, educationEnrollment)}
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

export default EducationEnrollmentTableView;
