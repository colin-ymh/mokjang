import { ReactNode } from "react";

import { HOME_CONTENT_ID, MEMBER_CONTENT_ID } from "@/constants/layout/content";
import {
  HEADER_ID,
  MEMBER_INFORMATION_HEADER_ID,
} from "@/constants/layout/header";
import MemberHeader from "@/components/organisms/layout/header/member-header";
import MemberList from "@/components/organisms/member/list/member-list";
import MemberInformationList from "@/components/molecules/member/information/member-information-list";
import { Member } from "@/models/member/member";
import PersonalInformationList from "@/components/molecules/member/information/member-personal-information-list";
import FamilyInformationList from "@/components/molecules/member/list/family-information-list";

export const getContent = (id: string): ReactNode => {
  switch (id) {
    case HOME_CONTENT_ID.HOME:
      return null;
    case MEMBER_CONTENT_ID.MEMBER:
      return <MemberList />;
    case MEMBER_CONTENT_ID.ADMINISTRATOR:
      return null;
    case MEMBER_CONTENT_ID.NEW_MEMBER:
      return null;
    default:
      return null;
  }
};

export const getHeader = (id: string) => {
  switch (id) {
    case HEADER_ID.HOME:
      return null;
    case HEADER_ID.MEMBER:
      return <MemberHeader />;
    default:
      return null;
  }
};

export const getMemberInformationContent = (
  id: string,
  targetMember: Member,
) => {
  switch (id) {
    // case MEMBER_INFORMATION_HEADER_ID.MEMBER_INFORMATION:
    //   return <MemberInformationList />;
    case MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION:
      return <PersonalInformationList targetMember={targetMember} />;
    case MEMBER_INFORMATION_HEADER_ID.FAMILY_INFORMATION:
      return <FamilyInformationList targetMember={targetMember} />;
  }
};
