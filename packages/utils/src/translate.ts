import { LOCALE } from '@mokjang/constants';

export const getTranslatedMemberCount = (
  basePath: LOCALE,
  memberCount: number
): string => {
  if (basePath === LOCALE.EN) {
    if (memberCount === 1) {
      return '1 member';
    } else {
      return `${memberCount} members`;
    }
  } else {
    return `${memberCount}명`;
  }
};

export const getTranslatedRestTrialDate = (basePath: LOCALE, date: number) => {
  if (basePath === LOCALE.EN) {
    if (date === 1) {
      return `1 day left in free trial`;
    } else {
      return `${date} days left in free trial`;
    }
  } else {
    return `무료체험 ${date}일 남음`;
  }
};
