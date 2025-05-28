import styled from 'styled-components';
import { EducationAttendance } from '@/models/education/education';
import React from 'react';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { useAttendanceStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { GRAY } from '@/constants/styles/color';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';

const AttendanceListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  overflow-y: auto;
`;

const AttendanceItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 5px;
  border-bottom: 1px solid ${GRAY.SEMI_LIGHT};

  &:last-child {
    border-bottom: none;
  }
`;

type EducationAttendanceListProps = {
  attendances: EducationAttendance[];
  onChangeStatus: (status: boolean, attendance: EducationAttendance) => void;
};

const EducationAttendanceList = ({
  attendances,
  onChangeStatus,
}: EducationAttendanceListProps) => {
  const statusDropdownItems = useAttendanceStatusDropdownItems();

  return (
    <AttendanceListContainer>
      {attendances?.map((attendance) => (
        <AttendanceItem key={attendance.id}>
          <MemberProfilePopupButton
            key={attendance.educationEnrollment.member.id}
            member={attendance.educationEnrollment.member}
          />

          <StatusDropdown
            value={attendance.isPresent}
            items={statusDropdownItems}
            height={30}
            width={100}
            onChangeItem={(value) => onChangeStatus(value, attendance)}
          />
        </AttendanceItem>
      ))}
    </AttendanceListContainer>
  );
};

export default EducationAttendanceList;
