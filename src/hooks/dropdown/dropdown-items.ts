import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import {
  BAPTISM,
  EDUCATION_STATUS,
  FAMILY,
  GENDER,
  MARRIAGE,
  NONE,
  NULL,
} from '@/constants/constant';
import { MEMBER } from '@/constants/member/member-column';

import { useI18n } from '../../../locales/client';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import {
  VISITATION_METHOD,
  VISITATION_STATUS,
} from '@/models/visitation/visitation';
import { VISITATION } from '@/constants/visitation/visitation-column';

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

  items.push({ value: NONE, title: t(NONE) });

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
      title: t(NONE),
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
    {
      value: MEMBER.MOBILE_PHONE,
      title: t(MEMBER.MOBILE_PHONE),
    },
    {
      value: MEMBER.ADDRESS,
      title: t(MEMBER.ADDRESS),
    },
    {
      value: MEMBER.HOME_PHONE,
      title: t(MEMBER.HOME_PHONE),
    },
    {
      value: MEMBER.OCCUPATION,
      title: t(MEMBER.OCCUPATION),
    },
  ];

  return items;
};

export const useVisitationSearchFilterDropdownItems = () => {
  const t = useI18n();

  const items = [
    {
      value: VISITATION.TITLE,
      title: t(VISITATION.TITLE),
    },
    {
      value: VISITATION.INSTRUCTOR,
      title: t(VISITATION.INSTRUCTOR),
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

export const useFamilyRelationDropdownItems = (gender?: GENDER | undefined) => {
  const t = useI18n();

  const maleItems = [
    {
      value: FAMILY.FATHER,
      title: t(FAMILY.FATHER),
    },
    {
      value: FAMILY.SON,
      title: t(FAMILY.SON),
    },
    {
      value: FAMILY.BROTHER,
      title: t(FAMILY.BROTHER),
    },
    {
      value: FAMILY.GRANDFATHER,
      title: t(FAMILY.GRANDFATHER),
    },
    {
      value: FAMILY.SON_IN_LAW,
      title: t(FAMILY.SON_IN_LAW),
    },
    {
      value: FAMILY.HUSBAND_FATHER_IN_LAW,
      title: t(FAMILY.HUSBAND_FATHER_IN_LAW),
    },
    {
      value: FAMILY.WIFE_FATHER_IN_LAW,
      title: t(FAMILY.WIFE_FATHER_IN_LAW),
    },
    {
      value: FAMILY.GRANDSON,
      title: t(FAMILY.GRANDSON),
    },
  ];

  const femaleItems = [
    {
      value: FAMILY.MOTHER,
      title: t(FAMILY.MOTHER),
    },
    {
      value: FAMILY.DAUGHTER,
      title: t(FAMILY.DAUGHTER),
    },
    {
      value: FAMILY.SISTER,
      title: t(FAMILY.SISTER),
    },
    {
      value: FAMILY.GRANDMOTHER,
      title: t(FAMILY.GRANDMOTHER),
    },
    {
      value: FAMILY.DAUGHTER_IN_LAW,
      title: t(FAMILY.DAUGHTER_IN_LAW),
    },
    {
      value: FAMILY.HUSBAND_MOTHER_IN_LAW,
      title: t(FAMILY.HUSBAND_MOTHER_IN_LAW),
    },
    {
      value: FAMILY.WIFE_MOTHER_IN_LAW,
      title: t(FAMILY.WIFE_MOTHER_IN_LAW),
    },
    {
      value: FAMILY.GRANDDAUGHTER,
      title: t(FAMILY.GRANDDAUGHTER),
    },
  ];

  const neutralItems = [
    {
      value: FAMILY.FAMILY,
      title: t(FAMILY.FAMILY),
    },
    {
      value: FAMILY.SPOUSE,
      title: t(FAMILY.SPOUSE),
    },
    {
      value: FAMILY.SIBLING,
      title: t(FAMILY.SIBLING),
    },
    {
      value: FAMILY.RELATIVE,
      title: t(FAMILY.RELATIVE),
    },
  ];

  let items: DropdownValueType[];

  if (!gender) {
    items = [...neutralItems, ...maleItems, ...femaleItems];
  } else if (gender === GENDER.MALE) {
    items = [...neutralItems, ...maleItems];
  } else {
    items = [...neutralItems, ...femaleItems];
  }

  return items;
};

export const useEducationStatusDropdownItems = () => {
  const t = useI18n();

  const items = [
    {
      value: EDUCATION_STATUS.IN_PROGRESS,
      title: t(EDUCATION_STATUS.IN_PROGRESS),
    },
    {
      value: EDUCATION_STATUS.COMPLETED,
      title: t(EDUCATION_STATUS.COMPLETED),
    },
    {
      value: EDUCATION_STATUS.INCOMPLETE,
      title: t(EDUCATION_STATUS.INCOMPLETE),
    },
  ];

  return items;
};

export const useVisitationStatusDropdownItems = () => {
  const t = useI18n();

  const items = [
    {
      value: VISITATION_STATUS.RESERVE,
      title: t(VISITATION_STATUS.RESERVE),
    },
    {
      value: VISITATION_STATUS.DONE,
      title: t(VISITATION_STATUS.DONE),
    },
    {
      value: VISITATION_STATUS.PENDING,
      title: t(VISITATION_STATUS.PENDING),
    },
  ];

  return items;
};

export const useVisitationMethodDropdownItems = () => {
  const t = useI18n();

  const items = [
    {
      value: VISITATION_METHOD.IN_PERSON,
      title: t(VISITATION_METHOD.IN_PERSON),
    },
    {
      value: VISITATION_METHOD.REMOTE,
      title: t(VISITATION_METHOD.REMOTE),
    },
  ];

  return items;
};
