import { useI18n } from '../../../locales/client';
import { GENDER } from '@/constants/constant';

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
