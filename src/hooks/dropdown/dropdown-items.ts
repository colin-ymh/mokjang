import { BAPTISM, OFFICER, MARRIAGE } from "@/constants/constant";
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
      value: BAPTISM.NONE,
      title: t(BAPTISM.NONE),
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
      value: OFFICER.NONE,
      title: t(OFFICER.NONE),
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
      value: MARRIAGE.NONE,
      title: t(MARRIAGE.NONE),
    },
  ];

  return items;
};
