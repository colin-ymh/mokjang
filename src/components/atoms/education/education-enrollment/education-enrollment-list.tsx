import styled from 'styled-components';
import { EducationEnrollment } from '@/models/education/education';
import { getRandomImage } from '@/utils/image';
import { MEMBER } from '@/constants/member/member-column';
import { MainText } from '@/components/atoms/common/text/main-text';
import React from 'react';
import Image from 'next/image';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { useEducationStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { GRAY } from '@/constants/styles/color';

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

type EducationEnrollmentListProps = {
  enrollments: EducationEnrollment[];
};

const EducationEnrollmentList = ({
  enrollments,
}: EducationEnrollmentListProps) => {
  const statusDropdownItems = useEducationStatusDropdownItems();
  return (
    <EnrollmentListContainer>
      {enrollments.map((enrollment) => (
        <EnrollmentItem key={enrollment.id}>
          <ProfileContainer>
            <ProfileImage
              src={
                enrollment.member?.profileImage ||
                getRandomImage(enrollment.memberId)
              }
              alt={MEMBER.PROFILE_IMAGE}
            />
            <MainText>{enrollment.member.name}</MainText>
          </ProfileContainer>

          <StatusDropdown
            value={enrollment.status}
            items={statusDropdownItems}
            height={30}
            width={100}
          />
        </EnrollmentItem>
      ))}
    </EnrollmentListContainer>
  );
};

export default EducationEnrollmentList;
