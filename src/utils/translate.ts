import { MEMBER } from '@/constants/member/member-column';
import {
  EDUCATION_ENROLLMENT,
  EDUCATION_TERM,
} from '@/constants/education/education-term-column';
import { VISITATION } from '@/constants/visitation/visitation-column';
import { TASK } from '@/constants/task/task-column';
import { EDUCATION } from '@/constants/education/education-column';

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
      | EDUCATION_TERM.NUMBER_OF_SESSION
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
      | VISITATION.INSTRUCTOR
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
