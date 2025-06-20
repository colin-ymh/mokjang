import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';
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
  description: string;
  sessionDate: string;
};

export const DEFAULT_WORSHIP_SESSION: WorshipSession = {
  id: BLANK,
  worshipId: BLANK,
  worship: DEFAULT_WORSHIP,
  title: BLANK,
  description: BLANK,
  sessionDate: BLANK,
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
};

export type WorshipAttendance = {
  id: string;
  worshipSession: WorshipSession;
  isAttended?: boolean;
  note: string;
  sessionDate: string;
  worshipEnrollment: WorshipEnrollment;
};

export const DEFAULT_WORSHIP_ATTENDANCE: WorshipAttendance = {
  id: BLANK,
  worshipSession: DEFAULT_WORSHIP_SESSION,
  note: BLANK,
  sessionDate: BLANK,
  worshipEnrollment: DEFAULT_WORSHIP_ENROLLMENT,
};
