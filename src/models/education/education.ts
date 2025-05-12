import { BLANK, EDUCATION_STATUS } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';
import { VisitationReport } from '@/models/visitation/visitation';

export type Education = {
  id: string;
  churchId: string;
  description: string;
  name: string;
  educationTerm: EducationTerm[];
};

export const DEFAULT_EDUCATION: Education = {
  id: BLANK,
  churchId: BLANK,
  description: BLANK,
  name: BLANK,
  educationTerm: [],
};

export type EducationEnrollment = {
  id: string;
  memberId: string;
  educationTermId: string;
  status: EDUCATION_STATUS;
  note: string;
  member: Member;
};

export const DEFAULT_EDUCATION_ENROLLMENT: EducationEnrollment = {
  id: BLANK,
  memberId: BLANK,
  educationTermId: BLANK,
  status: EDUCATION_STATUS.IN_PROGRESS,
  note: BLANK,
  member: DEFAULT_MEMBER,
};

export type EducationTerm = {
  id: string;
  educationId: string;
  educationName: string;
  term: string;
  numberOfSessions: string;
  completionCriteria?: string;
  startDate: string;
  endDate: string;
  instructorId?: string;
  enrollmentCount?: number;
  inProgressCount: number;
  completedCount: number;
  incompleteCount: number;
  instructor: Member;
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
  numberOfSessions: BLANK,
  startDate: BLANK,
  endDate: BLANK,
  inProgressCount: 0,
  completedCount: 0,
  incompleteCount: 0,
  educationSessions: [],
  educationEnrollments: [],
  educationName: BLANK,
  enrollmentCount: 0,
  instructor: DEFAULT_MEMBER,
  isDoneCount: 0,
  reports: [],
  receiverIds: [],
};

export type EducationSession = {
  id: string;
  educationTermId: string;
  session: number;
  content: string;
  sessionDate: string;
  isDone: boolean;
};

export const DEFAULT_EDUCATION_SESSION: EducationSession = {
  id: BLANK,
  educationTermId: BLANK,
  session: 0,
  content: BLANK,
  sessionDate: BLANK,
  isDone: false,
};

export type SessionAttendance = {
  id: string;
  educationSessionId: string;
  educationEnrollmentId: string;
  isPresent: boolean;
  note: string;
};

export const DEFAULT_SESSION_ATTENDANCE = {
  id: BLANK,
  educationSessionId: BLANK,
  educationEnrollmentId: BLANK,
  isPresent: false,
  note: BLANK,
};
