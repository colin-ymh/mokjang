import { Dispatch, ReactNode, SetStateAction } from 'react';

import {
  HOME_CONTENT_ID,
  MEMBER_CONTENT_ID,
  SETTING_CONTENT_ID,
} from '@/constants/layout/content';
import {
  GROUP_SETTING_HEADER_ID,
  HEADER_ID,
  MEMBER_INFORMATION_HEADER_ID,
} from '@/constants/layout/header';

import MemberTabHeader from '@/components/molecules/layout/header/member-tab-header';
import MemberList from '@/components/organisms/member/list/member-list';
import InformationList from '@/components/molecules/member/information/member-information-list';
import FamilyInformationList from '@/components/molecules/member/information/family-information-list';
import SettingTabHeader from '@/components/molecules/layout/header/setting-tab-header';
import MemberEducation from '@/components/molecules/member/information/member-education';
import GroupSetting from '@/components/organisms/setting/group-setting';
import GroupInformation from '@/components/molecules/setting/group-information';
import GroupMember from '@/components/molecules/setting/group-member';
import { Group } from '@/models/setting/group';

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
    case SETTING_CONTENT_ID.GROUP:
      return <GroupSetting />;
    case SETTING_CONTENT_ID.MINISTRY:
      return null;
    case SETTING_CONTENT_ID.EDUCATION:
      return null;
    case SETTING_CONTENT_ID.OFFICER:
      return null;
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
    case HEADER_ID.SETTING:
      return <SettingTabHeader />;
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
    case MEMBER_INFORMATION_HEADER_ID.EDUCATION:
      return <MemberEducation />;
  }
};

export const getGroupSettingContent = (contentId: string, group: Group) => {
  switch (contentId) {
    case GROUP_SETTING_HEADER_ID.GROUP_INFORMATION:
      return <GroupInformation group={group} />;
    case GROUP_SETTING_HEADER_ID.MEMBER_LIST:
      return <GroupMember group={group} />;
  }
};
