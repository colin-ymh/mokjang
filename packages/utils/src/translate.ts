import {
  BLANK,
  CHURCH_USER,
  EDUCATION,
  EDUCATION_ATTENDANCE,
  EDUCATION_ENROLLMENT,
  EDUCATION_SESSION,
  EDUCATION_TERM,
  JOIN_REQUEST,
  LOCALE,
  MEMBER,
  PERMISSION_TEMPLATE,
  TASK,
  USER,
  VISITATION,
  WORSHIP,
  WORSHIP_ATTENDANCE,
  WORSHIP_ENROLLMENT,
} from '@mokjang/constants';
import { getEnglishMonthName, getShortEnglishMonthName } from './format';

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

export const getTranslatedRestTrialDate = (basePath: LOCALE, date: number) => {
  if (basePath === LOCALE.EN) {
    if (date === 1) {
      return `1 day left in free trial`;
    } else {
      return `${date} days left in free trial`;
    }
  } else {
    return `무료체험 ${date}일 남음`;
  }
};

export const getTranslatedMaxRegisterMember = (
  basePath: LOCALE,
  memberCount: number
): string => {
  if (basePath === LOCALE.EN) {
    if (memberCount === 1) {
      return 'Register up to 1 member';
    } else {
      return `Register up to ${memberCount} members`;
    }
  } else {
    return `최대 ${memberCount}명까지 등록`;
  }
};

export const getTranslatedVerifyNumber = (
  basePath: LOCALE,
  phone: string
): string => {
  if (basePath === LOCALE.EN) {
    return `Verify Number sent to ${phone}`;
  } else {
    return `${phone}로 인증번호가 발송되었습니다`;
  }
};

export const getTranslatedCompleteRequest = (
  basePath: LOCALE,
  churchName: string
): string => {
  if (basePath === LOCALE.EN) {
    return `${churchName} administrator registration has been requested!`;
  } else {
    return `${churchName}에 관리자 등록이 신청되었습니다!`;
  }
};

export const getTranslatedMonthlySubscriptionPrice = (
  basePath: LOCALE,
  price: number
) => {
  const formattedPrice = price.toLocaleString();

  if (basePath === LOCALE.EN) {
    return `￦ ${formattedPrice} per month`;
  } else {
    return `월 ${formattedPrice} 원`;
  }
};

export const getTranslatedYearlySubscriptionPrice = (
  basePath: LOCALE,
  price: number
) => {
  const formattedPrice = price.toLocaleString();

  if (basePath === LOCALE.EN) {
    return `￦ ${formattedPrice} per year`;
  } else {
    return `연 ${formattedPrice} 원`;
  }
};

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
  if (id === EDUCATION.STATUS) return BLANK;
  else return t(id as EDUCATION);
};

export const getTranslatedEducationTermColumn = (
  t: (key: string, ...args: any[]) => string,
  id: EDUCATION_TERM
): string => {
  if (id === EDUCATION_TERM.STATUS) return BLANK;
  return t(id as 'educationName' | 'status' | EDUCATION_TERM.PERIOD);
};

export const getTranslatedEducationSessionColumn = (
  t: (key: string, ...args: any[]) => string,
  id: EDUCATION_SESSION
): string => {
  if (id === EDUCATION_SESSION.STATUS) return BLANK;
  return t(id as 'educationName' | 'status');
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
      | CHURCH_USER.JOINED_AT
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

export const getTranslatedEducationEnrollmentColumn = (
  t: (key: string, ...args: any[]) => string,
  id: EDUCATION_ENROLLMENT
): string => {
  return t(
    id as
      | EDUCATION_ENROLLMENT.MEMBER_NAME
      | EDUCATION_ENROLLMENT.GROUP
      | EDUCATION_ENROLLMENT.MOBILE_PHONE
      | EDUCATION_ENROLLMENT.ATTENDANCE
      | EDUCATION_ENROLLMENT.STATUS
  );
};

export const getTranslatedEducationAttendanceColumn = (
  t: (key: string, ...args: any[]) => string,
  id: EDUCATION_ATTENDANCE
): string => {
  return t(
    id as
      | EDUCATION_ATTENDANCE.MEMBER_NAME
      | EDUCATION_ATTENDANCE.AGE
      | EDUCATION_ATTENDANCE.GENDER
      | EDUCATION_ATTENDANCE.MOBILE_PHONE
      | EDUCATION_ATTENDANCE.NOTE
      | EDUCATION_ATTENDANCE.STATUS
  );
};

export const getTranslatedWorshipColumn = (
  t: (key: string, ...args: any[]) => string,
  id: WORSHIP
): string => {
  if (id === WORSHIP.ATTENDANCE) return BLANK;
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
export const getTranslatedFamilyAddMemberTitle = (
  locale: LOCALE,
  name: string
) => {
  if (locale === LOCALE.KO) {
    return `${name} 님의 가족 추가`;
  }

  return `Add ${name}'s Family Members`;
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

/**
 *
 * @param locale
 * @param name
 */
export const getTranslatedNewMinistryGroupLeader = (
  locale: LOCALE,
  name: string
) => {
  if (locale === LOCALE.KO) {
    return `${name} 님이 새로운 사역리더가 됩니다`;
  }

  return `${name} will be the new ministry leader`;
};

/**
 *
 * @param locale
 * @param name
 */
export const getTranslatedAlreadyMinistryGroupLeader = (
  locale: LOCALE,
  name: string
) => {
  if (locale === LOCALE.KO) {
    return `${name} 님은 현재 사역리더입니다.`;
  }

  return `${name} is current ministry leader.`;
};

/**
 *
 * @param locale
 * @param rangeTitle
 */
export const getTranslateWorshipAttendanceWidgetDescription = (
  locale: LOCALE,
  rangeTitle: string
) => {
  if (locale === LOCALE.KO) {
    return `${rangeTitle} 출석률 50% 미만`;
  }

  return `Under 50% attendance rate in ${rangeTitle}`;
};

// YYYY-MM-DD 을 YYYY년 MM월 DD일 형식으로 포맷
export const getTranslatedDateFromDateString = (
  basePath: LOCALE,
  date: string
): string => {
  if (!date) return ''; // 빈 입력 처리

  // YYYY-MM-DD에서 숫자만 남기기
  const cleaned = date.replace(/[^0-9]/g, '').slice(0, 8); // 숫자 외 제거

  if (basePath === LOCALE.KO) {
    // 입력된 문자열 길이 확인 후 포맷 적용
    switch (cleaned.length) {
      case 4: // YYYY
        return `${cleaned}년`;
      case 6: // YYYY MM
        return `${cleaned.slice(0, 4)}년 ${parseInt(cleaned.slice(4, 6), 10)}월`;
      case 8: // YYYY MM DD
        return `${cleaned.slice(0, 4)}년 ${parseInt(cleaned.slice(4, 6), 10)}월 ${parseInt(cleaned.slice(6), 10)}일`;
      default: // 유효하지 않은 경우
        return '';
    }
  } else {
    switch (cleaned.length) {
      case 4: // YYYY
        return cleaned; // 연도만 반환
      case 6: // YYYY MM
        return `${getEnglishMonthName(parseInt(cleaned.slice(4, 6), 10))} ${cleaned.slice(0, 4)}`;
      case 8: // YYYY MM DD
        return `${getEnglishMonthName(parseInt(cleaned.slice(4, 6), 10))} ${parseInt(cleaned.slice(6), 10)}, ${cleaned.slice(0, 4)}`;
      default: // 유효하지 않은 경우
        return '';
    }
  }
};

/**
 *
 * @param locale
 * @param term
 */
export const getTranslatedTerm = (locale: LOCALE, term: string) => {
  if (locale === LOCALE.KO) {
    return `${term}기`;
  } else {
    if (term === '1') return `1st`;
    if (term === '2') return `2nd`;
    if (term === '3') return `3rd`;
    return `${term}th`;
  }
};

/**
 *
 * @param locale
 * @param term
 */
export const getTranslatedTermCount = (locale: LOCALE, term: number) => {
  if (locale === LOCALE.KO) {
    return `${term}개 기수`;
  } else {
    if (term === 1) return `1 term`;
    return `${term} terms`;
  }
};

/**
 *
 * @param locale
 * @param completed
 * @param sessionsCount
 */
export const getTranslatedSessionProgressStatus = (
  locale: LOCALE,
  completed: number,
  sessionsCount: number
) => {
  if (locale === LOCALE.KO) {
    return `${completed}/${sessionsCount}회차 완료`;
  } else {
    return `${completed}/${sessionsCount} sessions completed`;
  }
};

/**
 *
 * @param locale
 * @param completedCount
 * @param enrollmentCount
 */
export const getTranslatedCompletedEnrollmentStatus = (
  locale: LOCALE,
  completedCount: number,
  enrollmentCount: number
) => {
  if (locale === LOCALE.KO) {
    return `${completedCount}/${enrollmentCount}명 수료`;
  } else {
    return `$${completedCount}/${enrollmentCount} completed`;
  }
};

/**
 *
 * @param locale
 * @param presentCount
 * @param totalSessions
 */
export const getTranslatedMemberAttendanceCount = (
  locale: LOCALE,
  presentCount: number,
  totalSessions: number
) => {
  if (locale === LOCALE.KO) {
    return `전체 ${totalSessions}회 중 ${presentCount}회 출석`;
  } else {
    return `attended ${presentCount} times per ${totalSessions} times`;
  }
};

export const getTranslatedSummaryCount = (
  basePath: LOCALE,
  summary: number
): string => {
  if (basePath === LOCALE.EN) {
    if (summary === 1) {
      return '1';
    } else {
      return `${summary}`;
    }
  } else {
    return `${summary}건`;
  }
};
