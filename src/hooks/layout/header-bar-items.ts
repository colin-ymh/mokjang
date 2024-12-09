import { MEMBER_CONTENT_ID } from "@/constants/layout/content";
import { MEMBER_INFORMATION_HEADER_ID } from "@/constants/layout/header";

import { useScopedI18n } from "../../../locales/client";

export const useMemberHeaderBarItems = () => {
  const t_memberContent = useScopedI18n("member-content");

  const items = [
    {
      id: MEMBER_CONTENT_ID.MEMBER,
      title: t_memberContent(MEMBER_CONTENT_ID.MEMBER),
    },
    {
      id: MEMBER_CONTENT_ID.ADMINISTRATOR,
      title: t_memberContent(MEMBER_CONTENT_ID.ADMINISTRATOR),
    },
    {
      id: MEMBER_CONTENT_ID.NEW_MEMBER,
      title: t_memberContent(MEMBER_CONTENT_ID.NEW_MEMBER),
    },
  ];

  return items;
};

export const useMemberInformationHeaderBarItems = () => {
  const t_header = useScopedI18n("header");

  const items = [
    {
      id: MEMBER_INFORMATION_HEADER_ID.MEMBER_INFORMATION,
      title: t_header(MEMBER_INFORMATION_HEADER_ID.MEMBER_INFORMATION),
    },
    {
      id: MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION,
      title: t_header(MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION),
    },
  ];

  return items;
};
