import { MEMBER } from '@/constants/column/member-column';
import { EDUCATION, EDUCATION_TERM } from '@/constants/column/education-column';
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
import { LOCALE } from '@/constants/state/locale';
import { getShortEnglishMonthName } from '@/utils/format';

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

export const getTranslatedBeforeSomeWeek = (
  basePath: LOCALE,
  week: number
): string => {
  if (basePath === LOCALE.EN) {
    if (week === 1) {
      return 'before 1 week';
    } else {
      return `before ${week} weeks`;
    }
  } else {
    return `${week}주 전`;
  }
};
export const getTranslatedMemberCount = (
  basePath: LOCALE,
  memberCount: number
): string => {
  if (basePath === LOCALE.EN) {
    if (memberCount === 1) {
      return '1 member';
    } else {
      return `${memberCount} members`;
    }
  } else {
    return `${memberCount}명`;
  }
};

export const getTranslatedSelectedMemberCount = (
  basePath: LOCALE,
  memberCount: number
): string => {
  if (basePath === LOCALE.EN) {
    if (memberCount === 1) {
      return '1 member selected';
    } else {
      return `${memberCount} members selected`;
    }
  } else {
    return `${memberCount}명 선택됨`;
  }
};

/**
 * Date Object => MM월 DD일 오후 HH:MM / 2 Feb. 5:30PM
 * @param date
 */
export const getTranslatedScheduleDate = (locale: LOCALE, date: Date) => {
  const month = String(date.getMonth() + 1); // 0-based index이므로 +1
  const day = String(date.getDate()).padStart(2, '0');

  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  if (locale === LOCALE.KO) {
    return `${month}월 ${day}일 ${hour}:${minute}`;
  }

  return `${day} ${getShortEnglishMonthName(parseInt(month) - 1)}. ${hour}:${minute}`;
};

/**
 * age => 21세 / 21y
 * @param locale
 * @param age
 */
export const getTranslatedAge = (locale: LOCALE, age: number) => {
  if (locale === LOCALE.KO) {
    return `${age}세`;
  }

  return `${age}y`;
};

/**
 *
 * @param locale
 * @param name
 */
export const getTranslatedAddMemberTitle = (locale: LOCALE, name: string) => {
  if (locale === LOCALE.KO) {
    return `${name} 에 교인 추가`;
  }

  return `Add Members to ${name}`;
};

/**
 *
 * @param locale
 * @param name
 */
export const getTranslatedNewGroupLeader = (locale: LOCALE, name: string) => {
  if (locale === LOCALE.KO) {
    return `${name} 님이 새로운 그룹장이 됩니다`;
  }

  return `${name} will be the new group leader`;
};

/**
 *
 * @param locale
 * @param name
 */
export const getTranslatedAlreadyGroupLeader = (
  locale: LOCALE,
  name: string
) => {
  if (locale === LOCALE.KO) {
    return `${name} 님은 현재 그룹장입니다.`;
  }

  return `${name} is current group leader.`;
};
