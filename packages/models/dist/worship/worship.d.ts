import { Member } from '../member/member';
import { Group } from '../management/management';
export type Worship = {
    id: string;
    title: string;
    description: string;
    worshipDay: number;
    repeatPeriod: number;
    worshipTargetGroupIds: string[];
    worshipTargetGroups: WorshipTargetGroup[];
};
export declare const DEFAULT_WORSHIP: Worship;
export type WorshipStatistic = {
    worshipId: string;
    attendanceCheckRate: number;
    attendanceRate: {
        overall: number;
        period: number;
    };
};
export declare const DEFAULT_WORSHIP_STATISTIC: WorshipStatistic;
export type WorshipTargetGroup = {
    id: string;
    group: Group;
};
export type WorshipSession = {
    id: string;
    worshipId: string;
    worship: Worship;
    title: string;
    bibleTitle: string;
    description: string;
    videoUrl: string;
    note: string;
    sessionDate: string;
    inCharge: Member;
    inChargeId: string;
    worshipAttendances: WorshipAttendance[];
};
export declare const DEFAULT_WORSHIP_SESSION: WorshipSession;
export type WorshipSessionStatistic = {
    totalCount: number;
    presentCount: number;
    absentCount: number;
    unknownCount: number;
};
export declare const DEFAULT_WORSHIP_SESSION_STATISTIC: {
    totalCount: number;
    presentCount: number;
    absentCount: number;
    unknownCount: number;
};
export type WorshipSessionCheckStatus = {
    id: string;
    sessionDate: string;
    completeAttendanceCheck: boolean;
};
export declare const DEFAULT_WORSHIP_SESSION_CHECK_STATUS: {
    id: string;
    sessionDate: string;
    completeAttendanceCheck: boolean;
};
export type WorshipEnrollment = {
    id: string;
    worshipId: string;
    worship: Worship;
    memberId: string;
    member: Member;
    presentCount: number;
    absentCount: number;
    worshipAttendances: WorshipAttendance[];
    attendanceRate: number;
    lastPresentDate: string;
};
export declare const DEFAULT_WORSHIP_ENROLLMENT: WorshipEnrollment;
export declare enum WORSHIP_ATTENDANCE_STATUS {
    UNKNOWN = "unknown",
    PRESENT = "present",
    ABSENT = "absent"
}
export type WorshipAttendance = {
    id: string;
    worshipSession: WorshipSession;
    attendanceStatus: WORSHIP_ATTENDANCE_STATUS;
    note: string;
    sessionDate: string;
    worshipEnrollment: WorshipEnrollment;
};
export declare const DEFAULT_WORSHIP_ATTENDANCE: WorshipAttendance;
export type MemberAttendanceStatistic = {
    absentCount: number;
    attendanceRate: number;
    checkRate: number;
    presentCount: number;
    unknownCount: number;
    totalSessions: number;
};
export declare const DEFAULT_MEMBER_ATTENDANCE_STATISTIC: MemberAttendanceStatistic;
