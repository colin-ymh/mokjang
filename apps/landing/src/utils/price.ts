export const getYearlyPrice = (monthPrice: number) => {
  return (monthPrice * 12 * 9) / 10;
};
