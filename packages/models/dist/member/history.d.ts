import { MINISTRY_GROUP_ROLE } from '@mokjang/constants';
import { Group, Ministry, MinistryGroup, Officer } from '../management/management';
import { EducationTerm } from '../education/education';
import { EDUCATION_ENROLLMENT_STATUS } from '@mokjang/constants';
export type GroupHistory = {
    id: string;
    groupId: string;
    groupSnapShot: string;
    startDate: string;
    endDate: string;
    group: Group;
};
export declare const DEFAULT_GROUP_HISTORY: GroupHistory;
export type GroupDetailHistory = {
    id: string;
    memberId: string;
    groupHistoryId: string;
    role: 'leader';
    startDate: string;
    endDate: string;
};
export declare const DEFAULT_GROUP_DETAIL_HISTORY: GroupDetailHistory;
export type EducationHistory = {
    id: string;
    educationTerm: EducationTerm;
    educationTermId: string;
    memberId: string;
    memberName: string;
    note: string;
    status: EDUCATION_ENROLLMENT_STATUS;
};
export declare const DEFAULT_EDUCATION_HISTORY: EducationHistory;
export type MinistryHistory = {
    id: string;
    memberId: string;
    ministryGroup: MinistryGroup;
    ministrySnapShot: string;
    ministryGroupSnapShot: string;
    startDate: string;
    endDate: string;
    ministryGroupDetailHistory: MinistryDetailHistory[];
};
export declare const DEFAULT_MINISTRY_HISTORY: MinistryHistory;
export declare enum MINISTRY_DETAIL_TYPE {
    MINISTRY = "ministry",
    ROLE = "role"
}
export type MinistryDetailHistory = {
    id: string;
    startDate: string;
    endDate: string;
    type?: MINISTRY_DETAIL_TYPE;
    detail?: {
        ministryId?: string;
        ministryName?: string;
        role?: MINISTRY_GROUP_ROLE;
    };
    role?: MINISTRY_GROUP_ROLE;
    ministry?: Ministry;
};
export declare const DEFAULT_MINISTRY_DETAIL_HISTORY: MinistryDetailHistory;
export type OfficerHistory = {
    id: string;
    memberId: string;
    officerId: string;
    officerSnapShot: string;
    officerStartChurch?: string;
    startDate: string;
    endDate: string;
    officer: Officer;
};
export declare const DEFAULT_OFFICER_HISTORY: OfficerHistory;
