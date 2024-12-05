import { HEADER_ID } from "@/constants/layout/header";

import { useScopedI18n } from "../../../locales/client";

export const useSideBarItems = () => {
  const t_header = useScopedI18n("header");

  const items = [
    {
      id: HEADER_ID.HOME,
      title: t_header(HEADER_ID.HOME),
    },
    {
      id: HEADER_ID.MEMBER,
      title: t_header(HEADER_ID.MEMBER),
    },
  ];

  return items;
};
