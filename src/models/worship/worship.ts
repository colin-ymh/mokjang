import { BLANK } from '@/constants/constant';
import { DEFAULT_MEMBER, Member } from '@/models/member/member';
import { Group } from '@/models/management/management';

export type Worship = {
  id: string;
  title: string;
  description: string;
  worshipDay: number;
  repeatPeriod: number;
  worshipTargetGroupIds: string[];
  worshipTargetGroups: WorshipTargetGroup[];
};

export const DEFAULT_WORSHIP: Worship = {
  id: BLANK,
  title: BLANK,
  description: BLANK,
  worshipDay: 0,
  repeatPeriod: 1,
  worshipTargetGroupIds: [],
  worshipTargetGroups: [],
};

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

export const DEFAULT_WORSHIP_SESSION: WorshipSession = {
  id: BLANK,
  worshipId: BLANK,
  worship: DEFAULT_WORSHIP,
  title: BLANK,
  bibleTitle: BLANK,
  description: BLANK,
  videoUrl: BLANK,
  note: BLANK,
  inCharge: DEFAULT_MEMBER,
  inChargeId: BLANK,
  sessionDate: BLANK,
  worshipAttendances: [],
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

export const DEFAULT_WORSHIP_ENROLLMENT: WorshipEnrollment = {
  id: BLANK,
  worshipId: BLANK,
  worship: DEFAULT_WORSHIP,
  memberId: BLANK,
  member: DEFAULT_MEMBER,
  presentCount: 0,
  absentCount: 0,
  worshipAttendances: [],
  attendanceRate: 0,
  lastPresentDate: BLANK,
};

export enum WORSHIP_ATTENDANCE_STATUS {
  UNKNOWN = 'unknown',
  PRESENT = 'present',
  ABSENT = 'absent',
}

export type WorshipAttendance = {
  id: string;
  worshipSession: WorshipSession;
  attendanceStatus: WORSHIP_ATTENDANCE_STATUS;
  note: string;
  sessionDate: string;
  worshipEnrollment: WorshipEnrollment;
};

export const DEFAULT_WORSHIP_ATTENDANCE: WorshipAttendance = {
  id: BLANK,
  worshipSession: DEFAULT_WORSHIP_SESSION,
  attendanceStatus: WORSHIP_ATTENDANCE_STATUS.UNKNOWN,
  note: BLANK,
  sessionDate: BLANK,
  worshipEnrollment: DEFAULT_WORSHIP_ENROLLMENT,
};
