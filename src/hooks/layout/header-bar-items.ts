import {
  MEMBER_CONTENT_ID,
  SETTING_CONTENT_ID,
} from "@/constants/layout/content";
import { MEMBER_INFORMATION_HEADER_ID } from "@/constants/layout/header";

import { useI18n, useScopedI18n } from "../../../locales/client";

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
    // {
    //   id: MEMBER_INFORMATION_HEADER_ID.MEMBER_INFORMATION,
    //   title: t_header(MEMBER_INFORMATION_HEADER_ID.MEMBER_INFORMATION),
    // },
    {
      id: MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION,
      title: t_header(MEMBER_INFORMATION_HEADER_ID.PERSONAL_INFORMATION),
    },
    {
      id: MEMBER_INFORMATION_HEADER_ID.FAMILY_INFORMATION,
      title: t_header(MEMBER_INFORMATION_HEADER_ID.FAMILY_INFORMATION),
    },
  ];

  return items;
};

export const useSettingHeaderBarItems = () => {
  const t = useI18n();

  const items = [
    {
      id: SETTING_CONTENT_ID.GROUP,
      title: t(SETTING_CONTENT_ID.GROUP),
    },
    {
      id: SETTING_CONTENT_ID.OFFICER,
      title: t(SETTING_CONTENT_ID.OFFICER),
    },
    {
      id: SETTING_CONTENT_ID.MINISTRY,
      title: t(SETTING_CONTENT_ID.MINISTRY),
    },
    {
      id: SETTING_CONTENT_ID.EDUCATION,
      title: t(SETTING_CONTENT_ID.EDUCATION),
    },
  ];

  return items;
};
