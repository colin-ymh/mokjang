/**
 * YYYY.MM.HH => Date Object
 * @param dateString
 */
export const getDateFromString = (dateString: string) => {
  if (dateString.length > 9) return new Date(dateString);
  else return null;
};

export const getIsAdult = (date: Date | null) => {
  if (date === null) {
    return true;
  }

  const CURRENT_YEAR = new Date().getFullYear();
  const TARGET_YEAR = date.getFullYear();

  return CURRENT_YEAR - TARGET_YEAR > 18;
};
