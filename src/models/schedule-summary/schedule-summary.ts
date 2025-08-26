import { DOMAIN } from '@/models/permission/permission';
import { STATUS } from '@/constants/status/status';

export type ScheduleSummary = {
  [STATUS.RESERVE]: number;
  [STATUS.IN_PROGRESS]: number;
  [STATUS.DONE]: number;
  [STATUS.PENDING]: number;
};

export const DEFAULT_SCHEDULE_SUMMARY = {
  [STATUS.RESERVE]: 0,
  [STATUS.IN_PROGRESS]: 0,
  [STATUS.DONE]: 0,
  [STATUS.PENDING]: 0,
};

export type ChurchScheduleSummary = {
  [DOMAIN.TASK]: ScheduleSummary;
  [DOMAIN.VISITATION]: ScheduleSummary;
  [DOMAIN.EDUCATION_TERM]: ScheduleSummary;
  [DOMAIN.EDUCATION_SESSION]: ScheduleSummary;
};

export const DEFAULT_CHURCH_SCHEDULE_SUMMARY: ChurchScheduleSummary = {
  [DOMAIN.TASK]: DEFAULT_SCHEDULE_SUMMARY,
  [DOMAIN.VISITATION]: DEFAULT_SCHEDULE_SUMMARY,
  [DOMAIN.EDUCATION_TERM]: DEFAULT_SCHEDULE_SUMMARY,
  [DOMAIN.EDUCATION_SESSION]: DEFAULT_SCHEDULE_SUMMARY,
};
