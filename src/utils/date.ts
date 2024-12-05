/**
 * YYYY-MM-dd => Date Object
 * @param dateString
 */
export const getDateFromString = (dateString: string) => {
  const lengthLimit = 10;
  const limited = dateString.slice(0, lengthLimit);

  if (limited.length === 10) return new Date(limited);
  else return null;
};

/**
 * 사용자의 생년월일 date object를 통해 미성년자인지 확인
 * @param date
 * @return {boolean}
 */
export const getIsChild = (date: Date | null): boolean => {
  if (date === null) {
    return false;
  }

  const CURRENT_YEAR = new Date().getFullYear();
  const TARGET_YEAR = date.getFullYear();

  return CURRENT_YEAR - TARGET_YEAR <= 18;
};
