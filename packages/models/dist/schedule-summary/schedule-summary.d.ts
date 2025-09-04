import { DOMAIN } from '../permission/permission';
import { STATUS } from '@mokjang/constants';
export type ScheduleSummary = {
    [STATUS.RESERVE]: number;
    [STATUS.IN_PROGRESS]: number;
    [STATUS.DONE]: number;
    [STATUS.PENDING]: number;
};
export declare const DEFAULT_SCHEDULE_SUMMARY: {
    reserve: number;
    inProgress: number;
    done: number;
    pending: number;
};
export type ChurchScheduleSummary = {
    [DOMAIN.TASK]: ScheduleSummary;
    [DOMAIN.VISITATION]: ScheduleSummary;
    [DOMAIN.EDUCATION_TERM]: ScheduleSummary;
    [DOMAIN.EDUCATION_SESSION]: ScheduleSummary;
};
export declare const DEFAULT_CHURCH_SCHEDULE_SUMMARY: ChurchScheduleSummary;
