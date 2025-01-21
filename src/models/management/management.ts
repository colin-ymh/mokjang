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
  roles: GroupRole[];
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
  roles: [],
};

export type GroupRole = {
  id: string;
  churchId: string;
  groupId: string;
  role: string;
};

export const DEFAULT_GROUP_ROLE = {
  id: BLANK,
  churchId: BLANK,
  groupId: BLANK,
  role: BLANK,
};

export type MinistryGroup = {
  churchId: string;
  name: string;
  parentMinistryGroupId: string | null;
  id: string | null;
  childMinistryGroupIds: string[];
  childMinistryGroups?: MinistryGroup[];
  ministries?: Ministry[];
};

export const DEFAULT_MINISTRY_GROUP = {
  churchId: BLANK,
  name: BLANK,
  parentMinistryGroupId: BLANK,
  id: BLANK,
  childMinistryGroupIds: [],
};

export type Ministry = {
  id: string;
  name: string;
  membersCount: number;
  churchId: string;
  ministryGroupId: string;
  ministryGroup?: MinistryGroup;
};

export const DEFAULT_MINISTRY = {
  id: BLANK,
  name: BLANK,
  membersCount: 0,
  churchId: BLANK,
  ministryGroupId: BLANK,
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
  id: string;
  memberId: string;
  memberName: string;
  educationTermId: string;
  status: EDUCATION_STATUS;
  note: string;
  member: Member;
};

export const DEFAULT_EDUCATION_ENROLLMENT: EducationEnrollment = {
  id: BLANK,
  memberId: BLANK,
  memberName: BLANK,
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
  completionCriteria?: number;
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
};

export type EducationSession = {
  id: string;
  educationTermId: string;
  session: number;
  content: string;
};

export const DEFAULT_EDUCATION_SESSION: EducationSession = {
  id: BLANK,
  educationTermId: BLANK,
  session: 0,
  content: BLANK,
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
