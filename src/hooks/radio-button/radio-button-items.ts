import { useI18n } from '../../../locales/client';
import { GENDER, SEARCH_RANGE } from '@/constants/constant';

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

export const useRangeRadioButtonItems = () => {
  const t = useI18n();

  const items = [
    {
      value: SEARCH_RANGE.WEEKLY,
      title: t('thisWeek'),
    },
    {
      value: SEARCH_RANGE.MONTHLY,
      title: t('thisMonth'),
    },
  ];
  return items;
};

export const useLunarSolarRadioButtonItems = () => {
  const t = useI18n();

  const items = [
    {
      value: false,
      title: t('solar'),
    },
    {
      value: true,
      title: t('lunar'),
    },
  ];
  return items;
};
