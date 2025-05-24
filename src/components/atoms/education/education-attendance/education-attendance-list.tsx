import styled from 'styled-components';
import { EducationAttendance } from '@/models/education/education';
import { getRandomImage } from '@/utils/image';
import { MEMBER } from '@/constants/member/member-column';
import { MainText } from '@/components/atoms/common/text/main-text';
import React from 'react';
import Image from 'next/image';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { useAttendanceStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { GRAY } from '@/constants/styles/color';

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

const ProfileContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 20%;
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
          <ProfileContainer>
            <ProfileImage
              src={
                attendance.educationEnrollment.member.profileImage ||
                getRandomImage(attendance.educationEnrollment.memberId)
              }
              alt={MEMBER.PROFILE_IMAGE}
            />
            <MainText>{attendance.educationEnrollment.member.name}</MainText>
          </ProfileContainer>

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
