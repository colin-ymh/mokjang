import { Dispatch, ReactNode, SetStateAction } from 'react';

import {
  CHURCH_CONTENT_ID,
  EDUCATION_CONTENT_ID,
  HOME_CONTENT_ID,
  MEMBER_CONTENT_ID,
} from '@/constants/layout/content';
import {
  EDUCATION_MANAGEMENT_HEADER_ID,
  GROUP_MANAGEMENT_HEADER_ID,
  MAIN_HEADER_ID,
  MANAGEMENT_HEADER_ID,
  MEMBER_INFORMATION_HEADER_ID,
  MINISTRY_MANAGEMENT_HEADER_ID,
  SIDE_ID,
} from '@/constants/layout/header';

import MainMemberHeader from '@/components/molecules/layout/header/main/member/main-member-header';
import MemberList from '@/components/organisms/member/list/member-list';
import MemberInformationList from '@/components/molecules/member/information/member-information-list';
import FamilyInformationList from '@/components/molecules/member/information/family-information-list';
import MemberEducation from '@/components/molecules/member/information/member-education';
import GroupManagement from '@/components/organisms/management/group/group-management';
import { Group, MinistryGroup } from '@/models/management/management';
import MemberGroup from '@/components/molecules/member/information/member-group';
import OfficerManagement from '@/components/organisms/management/officer/officer-management';
import MinistryGroupInformation from '@/components/molecules/management/ministry/ministry-group-information';
import MinistryGroupMember from '@/components/molecules/management/ministry/ministry-group-member';
import MinistryGroupManagement from '@/components/organisms/management/ministry/ministry-group-management';
import MemberMinistry from '@/components/molecules/member/information/member-ministry';
import GroupInformation from '@/components/molecules/management/group/group-information';
import MemberOfficer from '@/components/molecules/member/information/member-officer';
import GroupMember from '@/components/molecules/management/group/group-member';
import MainSideButtonList from '@/components/molecules/layout/side/main-side/main-side-button-list';
import ManagementSideButtonList from '@/components/molecules/layout/side/management-side/management-side-button-list';
import ManagementChurchHeader from '@/components/molecules/layout/header/management/management-church-header';
import ManagementAdministratorHeader from '@/components/molecules/layout/header/management/management-administrator-header';
import MainVisitationHeader from '@/components/molecules/layout/header/main/visitation/main-visitation-header';
import MainEducationHeader from '@/components/molecules/layout/header/main/education/main-education-header';
import VisitationList from '@/components/organisms/visitation/list/visitation-list';
import TaskList from '@/components/organisms/task/list/task-list';
import MainTaskHeader from '@/components/molecules/layout/header/main/task/main-task-header';
import EducationList from '@/components/organisms/education/education/list/education-list';
import { Education } from '@/models/education/education';

import EducationTermList from '@/components/organisms/education/education-term/list/education-term-list';
import { HEADER_BAR } from '@/constants/constant';
import MemberInformationListView from '@/components/molecules/member/information/member-information-list.view';

export const getSide = (id: string) => {
  switch (id) {
    case SIDE_ID.MAIN:
      return <MainSideButtonList />;
    case SIDE_ID.NOTIFICATION:
      return null;
    case SIDE_ID.MANAGEMENT:
      return <ManagementSideButtonList />;
    case SIDE_ID.GUIDE:
      return null;
    default:
      return null;
  }
};

export const getHeader = (id: string) => {
  switch (id) {
    // 메인
    case MAIN_HEADER_ID.HOME:
      return null;
    case MAIN_HEADER_ID.MEMBER:
      return <MainMemberHeader />;
    case MAIN_HEADER_ID.VISITATION:
      return <MainVisitationHeader />;
    case MAIN_HEADER_ID.EDUCATION:
      return <MainEducationHeader />;

    case MAIN_HEADER_ID.TASK:
      return <MainTaskHeader />;
    case MAIN_HEADER_ID.CALENDAR:
      return null;
    // 관리
    case MANAGEMENT_HEADER_ID.CHURCH:
      return <ManagementChurchHeader />;
    case MANAGEMENT_HEADER_ID.ADMINISTRATOR:
      return <ManagementAdministratorHeader />;
    default:
      return null;
  }
};

export const getContent = (id: string, headerId: string | null): ReactNode => {
  switch (id) {
    // 전체
    case HEADER_BAR.ALL:
      if (headerId === MAIN_HEADER_ID.MEMBER) {
        return <MemberList />;
      } else if (headerId === MAIN_HEADER_ID.VISITATION) {
        return <VisitationList />;
      } else if (headerId === MAIN_HEADER_ID.EDUCATION) {
        return <EducationList />;
      } else if (headerId === MAIN_HEADER_ID.TASK) {
        return <TaskList />;
      } else {
        return null;
      }

    // 내 ~~
    case HEADER_BAR.MY:
      if (headerId === MAIN_HEADER_ID.VISITATION) {
        return <VisitationList headerType={HEADER_BAR.MY} />;
      } else if (headerId === MAIN_HEADER_ID.TASK) {
        return <TaskList headerType={HEADER_BAR.MY} />;
      } else {
        return null;
      }

    // 보고받은 ~~
    case HEADER_BAR.REPORTED:
      if (headerId === MAIN_HEADER_ID.VISITATION) {
        return <VisitationList headerType={HEADER_BAR.REPORTED} />;
      } else if (headerId === MAIN_HEADER_ID.TASK) {
        return <TaskList headerType={HEADER_BAR.REPORTED} />;
      } else {
        return null;
      }

    // 홈
    case HOME_CONTENT_ID.HOME:
      return null;

    // 교인 관리
    case MEMBER_CONTENT_ID.ADMINISTRATOR:
      return <MemberList />;
    case MEMBER_CONTENT_ID.NEW:
      return <MemberList isNewMember={true} />;

    // 교육
    case EDUCATION_CONTENT_ID.IN_PROGRESS:
      return <EducationTermList isInProgress={true} />;
    case EDUCATION_CONTENT_ID.TERM:
      return <EducationTermList />;

    // 교회 설정
    case CHURCH_CONTENT_ID.GROUP:
      return <GroupManagement />;
    case CHURCH_CONTENT_ID.MINISTRY:
      return <MinistryGroupManagement />;
    case CHURCH_CONTENT_ID.OFFICER:
      return <OfficerManagement />;
    // 그 외
    default:
      return null;
  }
};

export const getMemberInformationContent = (
  memberContentId: string,
  setMemberContentId: Dispatch<SetStateAction<string>>,
  isPopup?: boolean
) => {
  switch (memberContentId) {
    case MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION:
      if (isPopup) {
        return <MemberInformationListView />;
      } else {
        return <MemberInformationList />;
      }
    case MEMBER_INFORMATION_HEADER_ID.FAMILY_INFORMATION:
      return <FamilyInformationList setMemberContentId={setMemberContentId} />;
    case MEMBER_INFORMATION_HEADER_ID.GROUP:
      return <MemberGroup />;
    case MEMBER_INFORMATION_HEADER_ID.EDUCATION:
      return <MemberEducation />;
    case MEMBER_INFORMATION_HEADER_ID.MINISTRY:
      return <MemberMinistry />;
    case MEMBER_INFORMATION_HEADER_ID.OFFICER:
      return <MemberOfficer />;
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
  ministryGroup: MinistryGroup
) => {
  switch (contentId) {
    case MINISTRY_MANAGEMENT_HEADER_ID.MINISTRY_GROUP_INFORMATION:
      return <MinistryGroupInformation ministryGroup={ministryGroup} />;
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
      return <></>;
  }
};
