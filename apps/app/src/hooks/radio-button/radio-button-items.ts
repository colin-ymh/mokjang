import { useI18n } from '../../../locales/client';
import { GENDER, RANGE } from '../../constants/constant';

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

export const useWeekMonthRangeRadioButtonItems = () => {
  const t = useI18n();

  const items = [
    {
      value: RANGE.WEEKLY,
      title: t(RANGE.WEEKLY),
    },
    {
      value: RANGE.MONTHLY,
      title: t(RANGE.MONTHLY),
    },
  ];
  return items;
};

export const useMonthQuarterHalfRangeRadioButtonItems = () => {
  const t = useI18n();

  const items = [
    {
      value: RANGE.MONTHLY,
      title: t('monthlySeason'),
    },
    {
      value: RANGE.QUARTER,
      title: t(RANGE.QUARTER),
    },
    {
      value: RANGE.HALF,
      title: t(RANGE.HALF),
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
