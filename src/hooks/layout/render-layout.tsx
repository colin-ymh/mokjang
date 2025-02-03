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
  MINISTRY_MANAGEMENT_HEADER_ID,
} from '@/constants/layout/header';

import MemberTabHeader from '@/components/molecules/layout/header/member-tab-header';
import MemberList from '@/components/organisms/member/list/member-list';
import InformationList from '@/components/molecules/member/information/member-information-list';
import FamilyInformationList from '@/components/molecules/member/information/family-information-list';
import ManagementTabHeader from '@/components/molecules/layout/header/management-tab-header';
import MemberEducation from '@/components/molecules/member/information/member-education';
import GroupManagement from '@/components/organisms/management/group/group-management';
import GroupMember from '@/components/molecules/management/group/group-member';
import {
  Education,
  Group,
  MinistryGroup,
} from '@/models/management/management';
import MemberGroup from '@/components/molecules/member/information/member-group';
import EducationManagement from '@/components/organisms/management/education/education-management';
import OfficerManagement from '@/components/organisms/management/officer/officer-management';
import EducationTermList from '@/components/molecules/management/education/education-term-list';
import MinistryGroupInformation from '@/components/molecules/management/ministry/ministry-group-information';
import MinistryGroupMember from '@/components/molecules/management/ministry/ministry-group-member';
import MinistryGroupManagement from '@/components/organisms/management/ministry/ministry-group-management';
import MemberMinistry from '@/components/molecules/member/information/member-ministry';
import { Member } from '@/models/member/member';
import GroupInformation from '@/components/molecules/management/group/group-information';
import MemberOfficer from '@/components/molecules/member/information/member-officer';

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
      return <MinistryGroupManagement />;
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
  targetMember: Member,
  setTargetMember: Dispatch<SetStateAction<Member>>,
  contentId: string,
  setContentId: Dispatch<SetStateAction<string>>
) => {
  switch (contentId) {
    case MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION:
      return (
        <InformationList
          targetMemberId={targetMember.id}
          setTargetMember={setTargetMember}
        />
      );
    case MEMBER_INFORMATION_HEADER_ID.FAMILY_INFORMATION:
      return (
        <FamilyInformationList
          targetMember={targetMember}
          setTargetMember={setTargetMember}
          setContentId={setContentId}
        />
      );
    case MEMBER_INFORMATION_HEADER_ID.GROUP:
      return <MemberGroup targetMember={targetMember} />;
    case MEMBER_INFORMATION_HEADER_ID.EDUCATION:
      return <MemberEducation targetMember={targetMember} />;
    case MEMBER_INFORMATION_HEADER_ID.MINISTRY:
      return <MemberMinistry targetMember={targetMember} />;
    case MEMBER_INFORMATION_HEADER_ID.OFFICER:
      return <MemberOfficer targetMember={targetMember} />;
  }
};

export const getGroupManagementContent = (contentId: string, group: Group) => {
  switch (contentId) {
    case GROUP_MANAGEMENT_HEADER_ID.GROUP_INFORMATION:
      return <GroupInformation group={group} />;
    case GROUP_MANAGEMENT_HEADER_ID.MEMBER_LIST:
      return <GroupMember group={group} />;
  }
};

export const getMinistryGroupManagementContent = (
  contentId: string,
  ministryGroup: MinistryGroup,
  fetchMinistryGroups: () => void
) => {
  switch (contentId) {
    case MINISTRY_MANAGEMENT_HEADER_ID.MINISTRY_GROUP_INFORMATION:
      return (
        <MinistryGroupInformation
          ministryGroup={ministryGroup}
          fetchMinistryGroups={fetchMinistryGroups}
        />
      );
    case MINISTRY_MANAGEMENT_HEADER_ID.MINISTRY_MEMBER_LIST:
      return <MinistryGroupMember ministryGroup={ministryGroup} />;
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
