import { BAPTISM, OFFICER, MARRIAGE, NONE } from "@/constant/constant";
import { useI18n } from "../../../locales/client";

export const useBaptismDropdownItems = () => {
  const t = useI18n();

  const items = [
    {
      value: BAPTISM.BAPTIZED,
      title: t(BAPTISM.BAPTIZED),
    },
    {
      value: BAPTISM.IMMERSION_BAPTISM,
      title: t(BAPTISM.IMMERSION_BAPTISM),
    },
    {
      value: BAPTISM.INFANT_BAPTISM,
      title: t(BAPTISM.INFANT_BAPTISM),
    },
    {
      value: BAPTISM.CATECHUMENATE,
      title: t(BAPTISM.CATECHUMENATE),
    },
    {
      value: BAPTISM.CONFIRMATION,
      title: t(BAPTISM.CONFIRMATION),
    },
    {
      value: NONE,
      title: t(NONE),
    },
  ];

  return items;
};

export const useOfficerDropdownItems = () => {
  const t = useI18n();

  const items = [
    {
      value: OFFICER.DEACON,
      title: t(OFFICER.DEACON),
    },
    {
      value: OFFICER.EXHORTER,
      title: t(OFFICER.EXHORTER),
    },
    {
      value: OFFICER.ORDAINED_DEACON,
      title: t(OFFICER.ORDAINED_DEACON),
    },
    {
      value: OFFICER.ELDER,
      title: t(OFFICER.ELDER),
    },
    {
      value: NONE,
      title: t(NONE),
    },
  ];

  return items;
};

export const useMarriageDropdownItems = () => {
  const t = useI18n();

  const items = [
    {
      value: MARRIAGE.MARRIED,
      title: t(MARRIAGE.MARRIED),
    },
    {
      value: MARRIAGE.SINGLE,
      title: t(MARRIAGE.SINGLE),
    },
    {
      value: NONE,
      title: t(NONE),
    },
  ];

  return items;
};
