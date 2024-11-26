import { BAPTISM, CONFIRMATION, MARRIAGE, NONE } from "@/constant/constant";
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
      value: NONE,
      title: t(NONE),
    },
  ];

  return items;
};

export const useConfirmationDropdownItems = () => {
  const t = useI18n();

  const items = [
    {
      value: CONFIRMATION.DEACON,
      title: t(CONFIRMATION.DEACON),
    },
    {
      value: CONFIRMATION.EXHORTER,
      title: t(CONFIRMATION.EXHORTER),
    },
    {
      value: CONFIRMATION.ORDAINED_DEACON,
      title: t(CONFIRMATION.ORDAINED_DEACON),
    },
    {
      value: CONFIRMATION.ELDER,
      title: t(CONFIRMATION.ELDER),
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
