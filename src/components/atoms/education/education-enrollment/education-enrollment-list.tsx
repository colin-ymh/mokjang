import styled from 'styled-components';
import {
  EDUCATION_ENROLLMENT_STATUS,
  EducationEnrollment,
} from '@/models/education/education';
import React from 'react';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { useEducationEnrollmentStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { GRAY } from '@/constants/styles/color';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';

const EnrollmentListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  overflow-y: auto;
`;

const EnrollmentItem = styled.div`
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

type EducationEnrollmentListProps = {
  enrollments: EducationEnrollment[];
  onChangeStatus: (
    status: EDUCATION_ENROLLMENT_STATUS,
    enrollment: EducationEnrollment
  ) => void;
};

const EducationEnrollmentList = ({
  enrollments,
  onChangeStatus,
}: EducationEnrollmentListProps) => {
  const statusDropdownItems = useEducationEnrollmentStatusDropdownItems();

  return (
    <EnrollmentListContainer>
      {enrollments?.map((enrollment) => (
        <EnrollmentItem key={enrollment.id}>
          <MemberProfilePopupButton
            key={enrollment.member.id}
            member={enrollment.member}
          />

          <StatusDropdown
            value={enrollment.status}
            items={statusDropdownItems}
            height={30}
            width={100}
            onChangeItem={(value) => onChangeStatus(value, enrollment)}
          />
        </EnrollmentItem>
      ))}
    </EnrollmentListContainer>
  );
};

export default EducationEnrollmentList;
