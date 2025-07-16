import { getDateStringFromDate, getLastSunday } from '@/utils/date';

export type NewMemberSummary = {
  weekOfMonth: number;
  periodStart: string;
  count: number;
};

export const getInitialNewMemberSummaries = () => {
  const lastSunday = getLastSunday();

  const orderedSummaries: NewMemberSummary[] = [];

  for (let i = 0; i < 4; i++) {
    const targetDate = new Date(lastSunday);
    targetDate.setDate(targetDate.getDate() - 7 * i);

    orderedSummaries.push({
      weekOfMonth: 0,
      periodStart: getDateStringFromDate(targetDate),
      count: 0,
    });
  }

  return orderedSummaries;
};
