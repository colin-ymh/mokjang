import { MEMBER_CONTENT_ID } from "@/constants/layout/content";

import { useI18n, useScopedI18n } from "../../../locales/client";
import { MEMBER } from "@/constants/member/member-column";
import { MEMBER_INFORMATION_HEADER_ID } from "@/constants/layout/header";

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
  const t = useI18n();

  const items = [
    {
      id: MEMBER_INFORMATION_HEADER_ID.INFORMATION,
      title: t(MEMBER_INFORMATION_HEADER_ID.INFORMATION),
    },
  ];

  return items;
};
