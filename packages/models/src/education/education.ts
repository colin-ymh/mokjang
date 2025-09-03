import { BLANK } from '@mokjang/constants';
import { DEFAULT_MEMBER, Member } from '../member/member';
import {
  EDUCATION_ATTENDANCE_STATUS,
  EDUCATION_ENROLLMENT_STATUS,
  STATUS,
  TASK_STATUS,
} from '@mokjang/constants';
import { VisitationReport } from '../report/report';

export type Education = {
  id: string;
  churchId: string;
  description: string;
  name: string;
  educationTerms: EducationTerm[];
  status: TASK_STATUS;
  goals: string[];
  creator: Member;
  createdAt: string;
  descriptionSummary: string;
  termsCount: number;
  completionMembersCount: number;
};

export const DEFAULT_EDUCATION: Education = {
  id: BLANK,
  churchId: BLANK,
  description: BLANK,
  name: BLANK,
  educationTerms: [],
  status: STATUS.RESERVE,
  goals: [BLANK],
  creator: DEFAULT_MEMBER,
  createdAt: BLANK,
  descriptionSummary: BLANK,
  termsCount: 0,
  completionMembersCount: 0,
};

export type EducationEnrollment = {
  id: string;
  memberId: string;
  educationTermId: string;
  status: EDUCATION_ENROLLMENT_STATUS;
  member: Member;
  attendancesCount: number;
};

export const DEFAULT_EDUCATION_ENROLLMENT: EducationEnrollment = {
  id: BLANK,
  memberId: BLANK,
  educationTermId: BLANK,
  status: STATUS.INCOMPLETE,
  member: DEFAULT_MEMBER,
  attendancesCount: 0,
};

export type EducationTerm = {
  id: string;
  educationId: string;
  educationName: string;
  term: string;
  startDate: string;
  endDate: string;
  inChargeId: string;
  location: string;
  status: TASK_STATUS;
  enrollmentsCount: number;
  inProgressCount: number;
  completedMembersCount: number;
  completedSessionsCount: number;
  sessionsCount: number;
  inCharge: Member;
  educationSessions: EducationSession[];
  educationEnrollments: EducationEnrollment[];
  isDoneCount: number;
  reports: VisitationReport[];
  receiverIds: string[];
};

export const DEFAULT_EDUCATION_TERM: EducationTerm = {
  id: BLANK,
  educationId: BLANK,
  term: BLANK,
  location: BLANK,
  status: STATUS.IN_PROGRESS,
  startDate: BLANK,
  endDate: BLANK,
  inChargeId: BLANK,
  inProgressCount: 0,
  completedMembersCount: 0,
  sessionsCount: 0,
  educationSessions: [],
  educationEnrollments: [],
  educationName: BLANK,
  completedSessionsCount: 0,
  enrollmentsCount: 0,
  inCharge: DEFAULT_MEMBER,
  isDoneCount: 0,
  reports: [],
  receiverIds: [],
};

export type EducationSession = {
  id: string;
  status: TASK_STATUS;
  title: string;
  inChargeId: string;
  inCharge: Member;
  educationTermId: string;
  session: string;
  content: string;
  startDate: string;
  endDate: string;
  receiverIds: string[];
  reports: VisitationReport[];
  isDone: boolean;
  educationAttendances: EducationAttendance[];
};

export const DEFAULT_EDUCATION_SESSION: EducationSession = {
  id: BLANK,
  status: STATUS.RESERVE,
  educationTermId: BLANK,
  inChargeId: BLANK,
  inCharge: DEFAULT_MEMBER,
  session: BLANK,
  content: BLANK,
  title: BLANK,
  startDate: BLANK,
  endDate: BLANK,
  reports: [],
  receiverIds: [],
  isDone: false,
  educationAttendances: [],
};

export type EducationAttendance = {
  id: string;
  educationSessionId: string;
  educationEnrollmentId: string;
  status: EDUCATION_ATTENDANCE_STATUS;
  note: string;
  educationEnrollment: EducationEnrollment;
};

export const DEFAULT_EDUCATION_ATTENDANCE = {
  id: BLANK,
  educationSessionId: BLANK,
  educationEnrollmentId: BLANK,
  status: STATUS.NONE,
  note: BLANK,
  educationEnrollment: DEFAULT_EDUCATION_ENROLLMENT,
};
