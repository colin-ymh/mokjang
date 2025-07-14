import { MEMBER } from '@/constants/column/member-column';
import {
  EDUCATION,
  EDUCATION_ENROLLMENT,
  EDUCATION_TERM,
} from '@/constants/column/education-column';
import { VISITATION } from '@/constants/column/visitation-column';
import { TASK } from '@/constants/column/task-column';
import { USER } from '@/constants/column/user-column';
import { PERMISSION_TEMPLATE } from '@/constants/column/permission-column';
import { JOIN_REQUEST } from '@/constants/column/join-request-column';
import { CHURCH_USER } from '@/constants/column/church-user-column';
import {
  WORSHIP,
  WORSHIP_ATTENDANCE,
  WORSHIP_ENROLLMENT,
} from '@/constants/column/worship-column';

export const getTranslatedMemberColumn = (
  t: (key: string, ...args: any[]) => string,
  id: MEMBER
): string => {
  return t(
    id as
      | MEMBER.NAME
      | MEMBER.PROFILE_IMAGE
      | MEMBER.GENDER
      | MEMBER.OFFICER
      | MEMBER.AGE
      | MEMBER.MOBILE_PHONE
      | MEMBER.HOME_PHONE
      | MEMBER.ADDRESS
      | MEMBER.OCCUPATION
      | MEMBER.SCHOOL
      | MEMBER.MARRIAGE
      | MEMBER.BAPTISM
      | MEMBER.BIRTH
      | MEMBER.REGISTERED_AT
      | MEMBER.UPDATED_AT
  );
};

export const getTranslatedTermColumn = (
  t: (key: string, ...args: any[]) => string,
  id: EDUCATION_TERM
): string => {
  return t(
    id as
      | EDUCATION_TERM.TERM
      | EDUCATION_TERM.EDUCATION
      | EDUCATION_TERM.PERIOD
      | EDUCATION_TERM.EDUCATION_ENROLLMENTS
      | EDUCATION_TERM.IN_CHARGE
  );
};

export const getTranslatedEnrollmentColumn = (
  t: (key: string, ...args: any[]) => string,
  id: EDUCATION_ENROLLMENT
): string => {
  return t(
    id as
      | EDUCATION_ENROLLMENT.MEMBER_NAME
      | EDUCATION_ENROLLMENT.GROUP
      | EDUCATION_ENROLLMENT.AGE
      | EDUCATION_ENROLLMENT.ATTENDANCE
      | EDUCATION_ENROLLMENT.NOTE
      | EDUCATION_ENROLLMENT.MOBILE_PHONE
      | EDUCATION_ENROLLMENT.STATUS
  );
};

export const getTranslatedVisitationColumn = (
  t: (key: string, ...args: any[]) => string,
  id: VISITATION
): string => {
  return t(
    id as
      | VISITATION.TITLE
      | VISITATION.VISITED
      | VISITATION.STATUS
      | VISITATION.DATE
      | VISITATION.IN_CHARGE
  );
};

export const getTranslatedEducationColumn = (
  t: (key: string, ...args: any[]) => string,
  id: EDUCATION
): string => {
  return t('educationName');
};

export const getTranslatedEducationTermColumn = (
  t: (key: string, ...args: any[]) => string,
  id: EDUCATION_TERM
): string => {
  return t(id as 'educationName' | 'status' | EDUCATION_TERM.PERIOD);
};

export const getTranslatedTaskColumn = (
  t: (key: string, ...args: any[]) => string,
  id: TASK
): string => {
  return t(id as TASK.TITLE | TASK.STATUS | TASK.DATE | TASK.IN_CHARGE);
};

export const getTranslatedChurchUserColumn = (
  t: (key: string, ...args: any[]) => string,
  id: CHURCH_USER
): string => {
  return t(
    id as
      | CHURCH_USER.ACCOUNT
      | CHURCH_USER.MEMBER
      | CHURCH_USER.PERMISSION_TEMPLATE
      | CHURCH_USER.PERMISSION_ACTIVE
      | CHURCH_USER.PERMISSION_SCOPE
  );
};

export const getTranslatedPermissionTemplateColumn = (
  t: (key: string, ...args: any[]) => string,
  id: PERMISSION_TEMPLATE
): string => {
  return t(id as PERMISSION_TEMPLATE.TITLE);
};

export const getTranslatedJoinRequestColumn = (
  t: (key: string, ...args: any[]) => string,
  id: JOIN_REQUEST | USER
): string => {
  return t(
    id as
      | USER.NAME
      | USER.MOBILE_PHONE
      | JOIN_REQUEST.CREATED_AT
      | JOIN_REQUEST.STATUS
  );
};

export const getTranslatedAttendanceColumn = (
  t: (key: string, ...args: any[]) => string,
  id: WORSHIP_ENROLLMENT
): string => {
  return t(
    id as
      | WORSHIP_ENROLLMENT.NAME
      | WORSHIP_ENROLLMENT.GROUP
      | WORSHIP_ENROLLMENT.ATTENDANCE_RATE
  );
};

export const getTranslatedAttendanceInformationColumn = (
  t: (key: string, ...args: any[]) => string,
  id: WORSHIP_ATTENDANCE
): string => {
  return t(
    id as
      | WORSHIP_ATTENDANCE.NAME
      | WORSHIP_ATTENDANCE.ABSENT
      | WORSHIP_ATTENDANCE.PRESENT
      | WORSHIP_ATTENDANCE.NOTE
  );
};

export const getTranslatedWorshipColumn = (
  t: (key: string, ...args: any[]) => string,
  id: WORSHIP
): string => {
  return t(id as WORSHIP.TITLE);
};
