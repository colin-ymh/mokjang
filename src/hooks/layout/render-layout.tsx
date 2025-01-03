import { ReactNode } from "react";

import { HOME_CONTENT_ID, MEMBER_CONTENT_ID } from "@/constants/layout/content";
import {
  HEADER_ID,
  MEMBER_INFORMATION_HEADER_ID,
} from "@/constants/layout/header";
import MemberTabHeader from "@/components/molecules/layout/header/member-tab-header";
import MemberList from "@/components/organisms/member/list/member-list";
import { Member } from "@/models/member/member";
import InformationList from "@/components/molecules/member/information/member-information-list";
import FamilyInformationList from "@/components/molecules/member/information/family-information-list";
import SettingTabHeader from "@/components/molecules/layout/header/setting-tab-header";

export const getContent = (id: string): ReactNode => {
  switch (id) {
    case HOME_CONTENT_ID.HOME:
      return null;
    case MEMBER_CONTENT_ID.MEMBER:
      return <MemberList />;
    case MEMBER_CONTENT_ID.ADMINISTRATOR:
      return <MemberList />;
    case MEMBER_CONTENT_ID.NEW_MEMBER:
      return <MemberList isNewMember={true} />;
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

export const getMemberInformationContent = (id: string) => {
  switch (id) {
    // case MEMBER_INFORMATION_HEADER_ID.MEMBER_INFORMATION:
    //   return <MemberInformationList />;
    case MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION:
      return <InformationList />;
    case MEMBER_INFORMATION_HEADER_ID.FAMILY_INFORMATION:
      return <FamilyInformationList />;
  }
};
