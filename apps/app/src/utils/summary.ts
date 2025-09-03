import { ChurchScheduleSummary, ScheduleSummary } from '@mokjang/models';
import { STATUS } from '@mokjang/constants';

export const getTotalScheduleSummary = (summary: ChurchScheduleSummary) => {
  const total: ScheduleSummary = {
    [STATUS.RESERVE]: 0,
    [STATUS.IN_PROGRESS]: 0,
    [STATUS.DONE]: 0,
    [STATUS.PENDING]: 0,
  };

  Object.values(summary).forEach((domainSummary) => {
    total[STATUS.RESERVE] += domainSummary[STATUS.RESERVE];
    total[STATUS.IN_PROGRESS] += domainSummary[STATUS.IN_PROGRESS];
    total[STATUS.DONE] += domainSummary[STATUS.DONE];
    total[STATUS.PENDING] += domainSummary[STATUS.PENDING];
  });

  return total;
};

export const getTotalScheduleCount = (summary: ScheduleSummary) => {
  return Object.values(summary).reduce((acc, n) => acc + n, 0);
};
