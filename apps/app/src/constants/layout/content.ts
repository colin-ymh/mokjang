import { HEADER_BAR } from '../constant';

export enum HOME_CONTENT_ID {
  HOME = 'home',
}

export enum MEMBER_CONTENT_ID {
  ALL = HEADER_BAR.ALL,
  MANAGER = 'manager',
  NEW = 'new',
}

export enum ATTENDANCE_CONTENT_ID {
  WORSHIP = 'worship',
  ATTENDANCE = 'attendance',
}

export enum WORSHIP_CONTENT_ID {
  WORSHIP = 'worship',
  // ATTENDANCE = 'attendance',
}

export enum CALENDAR_CONTENT_ID {
  CALENDAR = 'calendar',
}

export enum CHURCH_CONTENT_ID {
  CHURCH = 'church',
  GROUP = 'group',
  OFFICER = 'officer',
  MINISTRY = 'ministry',
}

export enum USER_CONTENT_ID {
  USER = 'user',
}

export enum MANAGER_CONTENT_ID {
  MANAGER = 'manager',
}

export enum PERMISSION_CONTENT_ID {
  PERMISSION = 'permission',
}

export enum JOIN_REQUEST_CONTENT_ID {
  JOIN_REQUEST = 'join',
}

export enum VISITATION_CONTENT_ID {
  ALL = HEADER_BAR.ALL,
  MY = HEADER_BAR.MY,
  REPORTED = HEADER_BAR.REPORTED,
}

export enum TASK_CONTENT_ID {
  ALL = HEADER_BAR.ALL,
  MY = HEADER_BAR.MY,
  REPORTED = HEADER_BAR.REPORTED,
}

export enum EDUCATION_CONTENT_ID {
  ALL = HEADER_BAR.ALL,
  IN_PROGRESS = 'inProgress',
  TERM = 'term',
}

export enum EDUCATION_TERM_CONTENT_ID {
  SESSIONS = 'educationSessions',
  ENROLLMENTS = 'educationEnrollments',
}

export enum EDUCATION_SESSION_CONTENT_ID {
  CONTENT = 'content',
  ATTENDANCE = 'educationAttendance',
}
