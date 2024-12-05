import { MEMBER_CONTENT_ID } from "@/constants/layout/content";

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
