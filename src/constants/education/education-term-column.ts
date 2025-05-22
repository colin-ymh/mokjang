import { MEMBER } from '@/constants/member/member-column';

export enum EDUCATION_TERM {
  ID = 'id',
  EDUCATION_ID = 'educationId',
  TERM = 'term',
  EDUCATION = 'education',
  IN_CHARGE = 'inCharge',
  EDUCATION_ENROLLMENTS = 'educationEnrollments',
  STATUS = 'status',

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
  CHECK = 'check',
  MEMBER_NAME = 'memberName',
  AGE = MEMBER.AGE,
  GROUP = MEMBER.GROUP,
  ATTENDANCE = 'attendance',
  NOTE = 'note',
  MOBILE_PHONE = MEMBER.MOBILE_PHONE,
  STATUS = 'status',
}

export type ENROLLMENT_TABLE_HEADER_ITEM = {
  id: EDUCATION_ENROLLMENT;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};
