import { BAPTISM } from "@/constant/constant";
import { useScopedI18n } from "../../../locales/client";

export const useBaptismDropdownItems = () => {
  const t_dropdown = useScopedI18n("dropdown");

  const items = [
    {
      value: BAPTISM.BAPTISM,
      title: t_dropdown(BAPTISM.BAPTISM),
    },
    {
      value: BAPTISM.IMMERSION_BAPTISM,
      title: t_dropdown(BAPTISM.IMMERSION_BAPTISM),
    },
    {
      value: BAPTISM.INFANT_BAPTISM,
      title: t_dropdown(BAPTISM.INFANT_BAPTISM),
    },
    {
      value: BAPTISM.CATECHUMENATE,
      title: t_dropdown(BAPTISM.CATECHUMENATE),
    },
    {
      value: BAPTISM.NONE,
      title: t_dropdown(BAPTISM.NONE),
    },
  ];

  return items;
};
