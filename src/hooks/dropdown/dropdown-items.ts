import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { BAPTISM, MARRIAGE, NONE, GENDER, NULL } from "@/constants/constant";
import { MEMBER } from "@/constants/member/member-column";

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
      value: MARRIAGE.MARRIED,
      title: t(MARRIAGE.MARRIED),
    },
    {
      value: MARRIAGE.SINGLE,
      title: t(MARRIAGE.SINGLE),
    },
    {
      value: NULL,
      title: t(NULL),
    },
  ];

  return items;
};

export const useSearchFilterDropdownItems = () => {
  const t = useI18n();

  const items = [
    {
      value: MEMBER.NAME,
      title: t(MEMBER.NAME),
    },
    {
      value: MEMBER.SCHOOL,
      title: t(MEMBER.SCHOOL),
    },
    {
      value: MEMBER.VEHICLE_NUMBER,
      title: t(MEMBER.VEHICLE_NUMBER),
    },
  ];

  return items;
};

export const useGenderDropdownItems = () => {
  const t = useI18n();

  const items = [
    {
      value: GENDER.MALE,
      title: t(GENDER.MALE),
    },
    {
      value: GENDER.FEMALE,
      title: t(GENDER.FEMALE),
    },
  ];

  return items;
};
