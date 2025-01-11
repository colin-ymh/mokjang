import { BLANK, EDUCATION_STATUS } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';

export type Group = {
  id: string | null;
  churchId: string;
  name: string;
  membersCount: number;
  parentGroupId: string | null;
  childGroupIds: string[];
  childGroups?: Group[];
  // members: Member[];
};

export const DEFAULT_GROUP = {
  id: BLANK,
  churchId: BLANK,
  name: BLANK,
  membersCount: 0,
  parentGroupId: BLANK,
  childGroupIds: [],
  members: [],
};

export type Education = {
  id: string;
  churchId: string;
  description: string;
  name: string;
  educationTerm: EducationTerm[];
  // membersCount: number;
  // inProgressCount: number;
  // completedCount: number;
  // incompleteCount: number;
};

export const DEFAULT_EDUCATION: Education = {
  id: BLANK,
  churchId: BLANK,
  description: BLANK,
  name: BLANK,
  educationTerm: [],
};

export type EducationEnrollment = {
  memberId: string;
  educationTermId: string;
  educationStatus: EDUCATION_STATUS;
  // sessionAttendance:
};

export const DEFAULT_EDUCATION_ENROLLMENT = {
  memberId: BLANK,
  educationTermId: BLANK,
  educationStatus: EDUCATION_STATUS.IN_PROGRESS,
};

export type EducationTerm = {
  id: string;
  educationId: string;
  term: number;
  numberOfSessions: number;
  completionCriteria?: number;
  startDate: string;
  endDate: string;
  instructorId?: string;
  inProgressCount: number;
  completedCount: number;
  incompleteCount: number;
  education: Education;
  instructor: Member;
  // 수정 필요
  educationSessions: EducationSession[];
  educationEnrollments: EducationEnrollment[];
};

export const DEFAULT_EDUCATION_TERM: EducationTerm = {
  id: BLANK,
  educationId: BLANK,
  term: 0,
  numberOfSessions: 0,
  startDate: BLANK,
  endDate: BLANK,
  inProgressCount: 0,
  completedCount: 0,
  incompleteCount: 0,
  educationSessions: [],
  educationEnrollments: [],
  education: DEFAULT_EDUCATION,
  instructor: DEFAULT_MEMBER,
};

export type EducationSession = {
  session: number;
  content: string;
  sessionAttendances: SessionAttendance[];
};

export const DEFAULT_EDUCATION_SESSION = {
  session: BLANK,
  content: BLANK,
  sessionAttendances: [],
};

export type SessionAttendance = {
  educationSessionId: string;
  educationEnrollmentId: string;
  isPresent: boolean;
  note: string;
};

export const DEFAULT_SESSION_ATTENDANCE = {
  educationSessionId: BLANK,
  educationEnrollmentId: BLANK,
  isPresent: false,
  note: BLANK,
};

export type Officer = {
  id: string;
  churchId: string;
  name: string;
  membersCount: number;
};

export const DEFAULT_OFFICER: Officer = {
  id: BLANK,
  churchId: BLANK,
  name: BLANK,
  membersCount: 0,
};
