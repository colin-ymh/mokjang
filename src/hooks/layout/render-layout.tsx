import { Dispatch, ReactNode, SetStateAction } from 'react';

import {
  HOME_CONTENT_ID,
  MANAGEMENT_CONTENT_ID,
  MEMBER_CONTENT_ID,
} from '@/constants/layout/content';
import {
  EDUCATION_MANAGEMENT_HEADER_ID,
  GROUP_MANAGEMENT_HEADER_ID,
  HEADER_ID,
  MEMBER_INFORMATION_HEADER_ID,
} from '@/constants/layout/header';

import MemberTabHeader from '@/components/molecules/layout/header/member-tab-header';
import MemberList from '@/components/organisms/member/list/member-list';
import InformationList from '@/components/molecules/member/information/member-information-list';
import FamilyInformationList from '@/components/molecules/member/information/family-information-list';
import ManagementTabHeader from '@/components/molecules/layout/header/management-tab-header';
import MemberEducation from '@/components/molecules/member/information/member-education';
import GroupManagement from '@/components/organisms/management/group/group-management';
import GroupInformation from '@/components/molecules/management/group/group-information';
import GroupMember from '@/components/molecules/management/group/group-member';
import { Education, Group } from '@/models/management/management';
import MemberGroup from '@/components/molecules/member/information/member-group';
import EducationManagement from '@/components/organisms/management/education/education-management';
import OfficerManagement from '@/components/organisms/management/officer/officer-management';
import EducationTermList from '@/components/molecules/management/education/education-term-list';

export const getContent = (id: string): ReactNode => {
  switch (id) {
    // 홈
    case HOME_CONTENT_ID.HOME:
      return null;
    // 교인 관리
    case MEMBER_CONTENT_ID.MEMBER:
      return <MemberList />;
    case MEMBER_CONTENT_ID.ADMINISTRATOR:
      return <MemberList />;
    case MEMBER_CONTENT_ID.NEW_MEMBER:
      return <MemberList isNewMember={true} />;
    // 교회 설정
    case MANAGEMENT_CONTENT_ID.GROUP:
      return <GroupManagement />;
    case MANAGEMENT_CONTENT_ID.MINISTRY:
      return null;
    case MANAGEMENT_CONTENT_ID.EDUCATION:
      return <EducationManagement />;
    case MANAGEMENT_CONTENT_ID.OFFICER:
      return <OfficerManagement />;
    // 그 외
    default:
      return null;
  }
};

export const getHeader = (id: string) => {
  switch (id) {
    case HEADER_ID.HOME:
      return null;
    case HEADER_ID.MEMBER:
      return <MemberTabHeader />;
    case HEADER_ID.MANAGEMENT:
      return <ManagementTabHeader />;
    default:
      return null;
  }
};

export const getMemberInformationContent = (
  contentId: string,
  setContentId: Dispatch<SetStateAction<string>>
) => {
  switch (contentId) {
    case MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION:
      return <InformationList />;
    case MEMBER_INFORMATION_HEADER_ID.FAMILY_INFORMATION:
      return <FamilyInformationList setContentId={setContentId} />;
    case MEMBER_INFORMATION_HEADER_ID.GROUP:
      return <MemberGroup />;
    case MEMBER_INFORMATION_HEADER_ID.EDUCATION:
      return <MemberEducation />;
  }
};

export const getGroupManagementContent = (contentId: string, group: Group) => {
  switch (contentId) {
    case GROUP_MANAGEMENT_HEADER_ID.GROUP_INFORMATION:
      return <GroupInformation groupId={group.id as string} />;
    case GROUP_MANAGEMENT_HEADER_ID.MEMBER_LIST:
      return <GroupMember group={group} />;
  }
};

export const getEducationManagementContent = (
  contentId: string,
  education: Education
) => {
  switch (contentId) {
    case EDUCATION_MANAGEMENT_HEADER_ID.TERM:
      return <EducationTermList education={education} />;
  }
};
