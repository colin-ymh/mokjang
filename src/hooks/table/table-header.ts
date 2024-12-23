import { MEMBER } from "@/constants/member/member-column";
import { useI18n } from "../../../locales/client";

export const useMemberTableItems = () => {
  const t = useI18n();

  const columns = [
    {
      id: MEMBER.NAME,
      title: t(MEMBER.NAME),
    },
    {
      id: MEMBER.MOBILE_PHONE,
      title: t(MEMBER.MOBILE_PHONE),
    },
    {
      id: MEMBER.GROUP,
      title: t(MEMBER.GROUP),
    },
    {
      id: MEMBER.GENDER,
      title: t(MEMBER.GENDER),
    },
    {
      id: MEMBER.BIRTH,
      title: t(MEMBER.BIRTH),
    },
    {
      id: MEMBER.OFFICER,
      title: t(MEMBER.OFFICER),
    },
    {
      id: MEMBER.MINISTRY,
      title: t(MEMBER.MINISTRY),
    },
    {
      id: MEMBER.EDUCATION,
      title: t(MEMBER.EDUCATION),
    },
  ];

  return columns;
};
