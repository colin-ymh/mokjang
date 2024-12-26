import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { BAPTISM, MARRIAGE, GENDER, NULL, FAMILY } from "@/constants/constant";
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
  const officers = useSelector((state: RootState) => state.church.officers);

  const items = officers.map((officer) => {
    return { value: officer.id, title: officer.name };
  });

  items.push({ value: NULL, title: t(NULL) });

  return items;
};

export const useMinistryDropdownItems = () => {
  const t = useI18n();
  const ministries = useSelector((state: RootState) => state.church.ministries);

  const items = ministries.map((ministry) => {
    return { value: ministry.id, title: ministry.name };
  });

  items.push({ value: NULL, title: t(NULL) });

  return items;
};

export const useEducationDropdownItems = () => {
  const t = useI18n();
  const educations = useSelector((state: RootState) => state.church.educations);

  const items = educations.map((educations) => {
    return { value: educations.id, title: educations.name };
  });

  items.push({ value: NULL, title: t(NULL) });

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

export const useGroupDropdownItems = () => {
  const t = useI18n();
  const groups = useSelector((state: RootState) => state.church.groups);

  const items = groups.map((group) => {
    return { value: group.id, title: group.name };
  });

  items.push({ value: NULL, title: t(NULL) });

  return items;
};

export const useFamilyRelationDropdownItems = () => {
  const t = useI18n();

  const items = [
    {
      value: FAMILY.FAMILY,
      title: t(FAMILY.FAMILY),
    },
    {
      value: FAMILY.SPOUSE,
      title: t(FAMILY.SPOUSE),
    },
    {
      value: FAMILY.MOTHER,
      title: t(FAMILY.MOTHER),
    },
    {
      value: FAMILY.FATHER,
      title: t(FAMILY.FATHER),
    },
    {
      value: FAMILY.CHILD,
      title: t(FAMILY.CHILD),
    },
    {
      value: FAMILY.SIBLING,
      title: t(FAMILY.SIBLING),
    },
    {
      value: FAMILY.GRAND_PARENT,
      title: t(FAMILY.GRAND_PARENT),
    },
    {
      value: FAMILY.SON_IN_LAW,
      title: t(FAMILY.SON_IN_LAW),
    },
    {
      value: FAMILY.DAUGHTER_IN_LAW,
      title: t(FAMILY.DAUGHTER_IN_LAW),
    },
    {
      value: FAMILY.HUSBAND_FATHER_IN_LAW,
      title: t(FAMILY.HUSBAND_FATHER_IN_LAW),
    },
    {
      value: FAMILY.HUSBAND_MOTHER_IN_LAW,
      title: t(FAMILY.HUSBAND_MOTHER_IN_LAW),
    },
    {
      value: FAMILY.WIFE_FATHER_IN_LAW,
      title: t(FAMILY.WIFE_FATHER_IN_LAW),
    },
    {
      value: FAMILY.WIFE_MOTHER_IN_LAW,
      title: t(FAMILY.WIFE_MOTHER_IN_LAW),
    },
    {
      value: FAMILY.RELATIVE,
      title: t(FAMILY.RELATIVE),
    },
  ];

  return items;
};
