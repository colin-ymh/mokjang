import { useI18n, useScopedI18n } from "../../../locales/client";
import {
  CALENDAR_MODE,
  GENDER,
  MEMBER_REGISTER_TYPE,
} from "@/constants/constant";

export const useMemberRegisterTypeRadioButtonItems = () => {
  const t_radiobutton = useScopedI18n("radiobutton");

  const items = [
    {
      value: MEMBER_REGISTER_TYPE.NEW,
      title: t_radiobutton(MEMBER_REGISTER_TYPE.NEW),
    },
    {
      value: MEMBER_REGISTER_TYPE.TRANSFERRED,
      title: t_radiobutton(MEMBER_REGISTER_TYPE.TRANSFERRED),
    },
  ];

  return items;
};

export const useGenderRadioButtonItems = () => {
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

export const useBirthRadioButtonItems = () => {
  const t = useI18n();

  const items = [
    {
      value: CALENDAR_MODE.SOLAR,
      title: t(CALENDAR_MODE.SOLAR),
    },
    {
      value: CALENDAR_MODE.LUNAR,
      title: t(CALENDAR_MODE.LUNAR),
    },
  ];

  return items;
};
