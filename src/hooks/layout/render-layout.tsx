import { ReactNode } from "react";

import { HOME_CONTENT_ID, MEMBER_CONTENT_ID } from "@/constants/layout/content";
import { HEADER_ID } from "@/constants/layout/header";
import MemberHeader from "@/components/organisms/member/member-header";

export const getContent = (id: string): ReactNode => {
  switch (id) {
    case HOME_CONTENT_ID.HOME:
      return null;
    case MEMBER_CONTENT_ID.MEMBER:
      return null;
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
