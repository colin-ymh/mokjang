import { MEMBER } from "@/constants/member/member-column";
import { useI18n } from "../../../locales/client";

export const useMemberTableItems = () => {
  const t = useI18n();

  const columns = [
    {
      id: MEMBER.GROUP,
      title: t(MEMBER.GROUP),
      isSortable: true,
    },
    {
      id: MEMBER.PROFILE_IMAGE,
      title: t(MEMBER.PROFILE_IMAGE),
    },
    {
      id: MEMBER.NAME,
      title: t(MEMBER.NAME),
      isSortable: true,
    },
    {
      id: MEMBER.GENDER,
      title: t(MEMBER.GENDER),
      isSortable: true,
    },
    {
      id: MEMBER.OFFICER,
      title: t(MEMBER.OFFICER),
      isSortable: true,
    },
    {
      id: MEMBER.AGE,
      title: t(MEMBER.AGE),
      isSortable: true,
    },
    {
      id: MEMBER.BIRTH,
      title: t(MEMBER.BIRTH),
      isSortable: true,
    },
    {
      id: MEMBER.MOBILE_PHONE,
      title: t(MEMBER.MOBILE_PHONE),
    },
  ];

  return columns;
};
