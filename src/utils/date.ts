/**
 * YYYY.MM.dd => Date Object
 * @param dateString 'yyyymmdd' or 'yyyymdd'
 */
export const getDateFromString = (dateString: string) => {
  const lengthLimit = 10;
  const limited = dateString.slice(0, lengthLimit);

  if (limited.length === 10) return new Date(limited);
  else return null;
};

export const getIsChild = (date: Date | null) => {
  if (date === null) {
    return false;
  }

  const CURRENT_YEAR = new Date().getFullYear();
  const TARGET_YEAR = date.getFullYear();

  return CURRENT_YEAR - TARGET_YEAR <= 18;
};
