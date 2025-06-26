import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';
import {
  EDUCATION_ENROLLMENT_STATUS,
  EDUCATION_SESSION_STATUS,
  EDUCATION_TERM_STATUS,
  STATUS,
} from '@/constants/status/status';
import { VisitationReport } from '@/models/report/report';

export type Education = {
  id: string;
  churchId: string;
  description: string;
  name: string;
  educationTerms: EducationTerm[];
};

export const DEFAULT_EDUCATION: Education = {
  id: BLANK,
  churchId: BLANK,
  description: BLANK,
  name: BLANK,
  educationTerms: [],
};

export type EducationEnrollment = {
  id: string;
  memberId: string;
  educationTermId: string;
  status: EDUCATION_ENROLLMENT_STATUS;
  note: string;
  member: Member;
};

export const DEFAULT_EDUCATION_ENROLLMENT: EducationEnrollment = {
  id: BLANK,
  memberId: BLANK,
  educationTermId: BLANK,
  status: STATUS.INCOMPLETE,
  note: BLANK,
  member: DEFAULT_MEMBER,
};

export type EducationTerm = {
  id: string;
  educationId: string;
  educationName: string;
  term: string;
  startDate: string;
  endDate: string;
  inChargeId: string;
  content: string;
  status: EDUCATION_TERM_STATUS;
  enrollmentCount?: number;
  inProgressCount: number;
  completedCount: number;
  incompleteCount: number;
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
  content: BLANK,
  status: STATUS.IN_PROGRESS,
  startDate: BLANK,
  endDate: BLANK,
  inChargeId: BLANK,
  inProgressCount: 0,
  completedCount: 0,
  incompleteCount: 0,
  educationSessions: [],
  educationEnrollments: [],
  educationName: BLANK,
  enrollmentCount: 0,
  inCharge: DEFAULT_MEMBER,
  isDoneCount: 0,
  reports: [],
  receiverIds: [],
};

export type EducationSession = {
  id: string;
  status: EDUCATION_SESSION_STATUS;
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
  isPresent: boolean;
  note: string;
  educationEnrollment: EducationEnrollment;
};

export const DEFAULT_EDUCATION_ATTENDANCE = {
  id: BLANK,
  educationSessionId: BLANK,
  educationEnrollmentId: BLANK,
  isPresent: false,
  note: BLANK,
  educationEnrollment: DEFAULT_EDUCATION_ENROLLMENT,
};
