import { MEMBER } from '@/constants/member/member-column';

export enum EDUCATION_TERM {
  ID = 'id',
  EDUCATION_ID = 'educationId',
  TERM = 'term',
  NUMBER_OF_SESSION = 'numberOfSession',
  COMPLETION_CRITERIA = 'completionCriteria',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  INSTRUCTOR_ID = 'instructorId',
  IN_PROGRESS_COUNT = 'inProgressCount',
  COMPLETED_COUNT = 'completedCount',
  INCOMPLETE_COUNT = 'incompleteCount',
  EDUCATION = 'education',
  INSTRUCTOR = 'instructor',
  EDUCATION_SESSIONS = 'educationSessions',
  EDUCATION_ENROLLMENTS = 'educationEnrollments',

  // 임의추가
  PERIOD = 'period',
}

export type TERM_TABLE_HEADER_ITEM = {
  id: EDUCATION_TERM;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};

export enum EDUCATION_ENROLLMENT {
  MEMBER_NAME = 'memberName',
  AGE = MEMBER.AGE,
  GROUP = MEMBER.GROUP,
  ATTENDANCE = 'attendance',
  NOTE = 'note',
  MOBILE_PHONE = MEMBER.MOBILE_PHONE,
}

export type ENROLLMENT_TABLE_HEADER_ITEM = {
  id: EDUCATION_ENROLLMENT;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};
