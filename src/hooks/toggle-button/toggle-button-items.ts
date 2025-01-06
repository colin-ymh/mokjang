import { useI18n } from '../../../locales/client';
import { GENDER, NONE } from '@/constants/constant';
import { BLUE, GRAY, RED } from '@/constants/styles/color';

export const useGenderToggleButtonItems = () => {
  const t = useI18n();

  const items = [
    {
      value: NONE,
      title: t('gender'),
      backgroundColor: GRAY.DEFAULT,
    },
    {
      value: GENDER.MALE,
      title: t(GENDER.MALE),
      backgroundColor: BLUE.DEFAULT,
    },
    {
      value: GENDER.FEMALE,
      title: t(GENDER.FEMALE),
      backgroundColor: RED.DEFAULT,
    },
  ];

  return items;
};
