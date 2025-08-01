import { MEMBER } from '@/constants/column/member-column';

export enum EDUCATION {
  NAME = 'name',
}

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

export enum EDUCATION_ENROLLMENT {
  MEMBER_NAME = 'memberName',
  AGE = MEMBER.AGE,
  GROUP = MEMBER.GROUP,
  ATTENDANCE = 'attendance',
  MOBILE_PHONE = MEMBER.MOBILE_PHONE,
  STATUS = 'status',
}

export enum EDUCATION_ATTENDANCE {
  MEMBER_NAME = 'memberName',
  AGE = MEMBER.AGE,
  GENDER = MEMBER.GENDER,
  MOBILE_PHONE = MEMBER.MOBILE_PHONE,
  STATUS = 'status',
  NOTE = 'note',
}
