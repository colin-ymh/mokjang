import { CHURCH_USER, EDUCATION, EDUCATION_ATTENDANCE, EDUCATION_ENROLLMENT, EDUCATION_SESSION, EDUCATION_TERM, JOIN_REQUEST, LOCALE, MEMBER, PERMISSION_TEMPLATE, TASK, USER, VISITATION, WORSHIP, WORSHIP_ATTENDANCE, WORSHIP_ENROLLMENT } from '@mokjang/constants';
export declare const getTranslatedMemberCount: (basePath: LOCALE, memberCount: number) => string;
export declare const getTranslatedRestTrialDate: (basePath: LOCALE, date: number) => string;
export declare const getTranslatedMaxRegisterMember: (basePath: LOCALE, memberCount: number) => string;
export declare const getTranslatedVerifyNumber: (basePath: LOCALE, phone: string) => string;
export declare const getTranslatedCompleteRequest: (basePath: LOCALE, churchName: string) => string;
export declare const getTranslatedMonthlySubscriptionPrice: (basePath: LOCALE, price: number) => string;
export declare const getTranslatedYearlySubscriptionPrice: (basePath: LOCALE, price: number) => string;
export declare const getTranslatedMemberColumn: (t: (key: string, ...args: any[]) => string, id: MEMBER) => string;
export declare const getTranslatedVisitationColumn: (t: (key: string, ...args: any[]) => string, id: VISITATION) => string;
export declare const getTranslatedEducationColumn: (t: (key: string, ...args: any[]) => string, id: EDUCATION) => string;
export declare const getTranslatedEducationTermColumn: (t: (key: string, ...args: any[]) => string, id: EDUCATION_TERM) => string;
export declare const getTranslatedEducationSessionColumn: (t: (key: string, ...args: any[]) => string, id: EDUCATION_SESSION) => string;
export declare const getTranslatedTaskColumn: (t: (key: string, ...args: any[]) => string, id: TASK) => string;
export declare const getTranslatedChurchUserColumn: (t: (key: string, ...args: any[]) => string, id: CHURCH_USER) => string;
export declare const getTranslatedPermissionTemplateColumn: (t: (key: string, ...args: any[]) => string, id: PERMISSION_TEMPLATE) => string;
export declare const getTranslatedJoinRequestColumn: (t: (key: string, ...args: any[]) => string, id: JOIN_REQUEST | USER) => string;
export declare const getTranslatedAttendanceColumn: (t: (key: string, ...args: any[]) => string, id: WORSHIP_ENROLLMENT) => string;
export declare const getTranslatedAttendanceInformationColumn: (t: (key: string, ...args: any[]) => string, id: WORSHIP_ATTENDANCE) => string;
export declare const getTranslatedEducationEnrollmentColumn: (t: (key: string, ...args: any[]) => string, id: EDUCATION_ENROLLMENT) => string;
export declare const getTranslatedEducationAttendanceColumn: (t: (key: string, ...args: any[]) => string, id: EDUCATION_ATTENDANCE) => string;
export declare const getTranslatedWorshipColumn: (t: (key: string, ...args: any[]) => string, id: WORSHIP) => string;
export declare const getTranslatedBeforeSomeWeek: (basePath: LOCALE, week: number) => string;
export declare const getTranslatedSelectedMemberCount: (basePath: LOCALE, memberCount: number) => string;
/**
 * Date Object => MM월 DD일 오후 HH:MM / 2 Feb. 5:30PM
 * @param date
 */
export declare const getTranslatedScheduleDate: (locale: LOCALE, date: Date) => string;
/**
 * age => 21세 / 21y
 * @param locale
 * @param age
 */
export declare const getTranslatedAge: (locale: LOCALE, age: number) => string;
/**
 *
 * @param locale
 * @param name
 */
export declare const getTranslatedAddMemberTitle: (locale: LOCALE, name: string) => string;
/**
 *
 * @param locale
 * @param name
 */
export declare const getTranslatedFamilyAddMemberTitle: (locale: LOCALE, name: string) => string;
/**
 *
 * @param locale
 * @param name
 */
export declare const getTranslatedNewGroupLeader: (locale: LOCALE, name: string) => string;
/**
 *
 * @param locale
 * @param name
 */
export declare const getTranslatedAlreadyGroupLeader: (locale: LOCALE, name: string) => string;
/**
 *
 * @param locale
 * @param name
 */
export declare const getTranslatedNewMinistryGroupLeader: (locale: LOCALE, name: string) => string;
/**
 *
 * @param locale
 * @param name
 */
export declare const getTranslatedAlreadyMinistryGroupLeader: (locale: LOCALE, name: string) => string;
/**
 *
 * @param locale
 * @param rangeTitle
 */
export declare const getTranslateWorshipAttendanceWidgetDescription: (locale: LOCALE, rangeTitle: string) => string;
export declare const getTranslatedDateFromDateString: (basePath: LOCALE, date: string) => string;
export declare const getTranslatedStartEndDate: (basePath: LOCALE, startDate?: string, endDate?: string) => string;
export declare const getTranslatedStartEndDateTime: (basePath: LOCALE, startDate?: string, endDate?: string) => string;
export declare const getTranslatedMMDDDateFromDateString: (basePath: LOCALE, date: string) => string;
/**
 *
 * @param locale
 * @param term
 */
export declare const getTranslatedTerm: (locale: LOCALE, term: string) => string;
/**
 *
 * @param locale
 * @param term
 */
export declare const getTranslatedTermCount: (locale: LOCALE, term: number) => string;
/**
 *
 * @param locale
 * @param completed
 * @param sessionsCount
 */
export declare const getTranslatedSessionProgressStatus: (locale: LOCALE, completed: number, sessionsCount: number) => string;
/**
 *
 * @param locale
 * @param completedCount
 * @param enrollmentCount
 */
export declare const getTranslatedCompletedEnrollmentStatus: (locale: LOCALE, completedCount: number, enrollmentCount: number) => string;
/**
 *
 * @param locale
 * @param presentCount
 * @param totalSessions
 */
export declare const getTranslatedMemberAttendanceCount: (locale: LOCALE, presentCount: number, totalSessions: number) => string;
/**
 *
 * @param locale
 * @param unknownCount
 */
export declare const getTranslatedUnknownAttendanceCount: (locale: LOCALE, unknownCount: number) => string;
export declare const getTranslatedSummaryCount: (basePath: LOCALE, summary: number) => string;
/**
 * ISO 문자열과 현재 시간의 차이를 간단한 "n분 전" / "n hours ago" 형태로 반환.
 */
export declare function getTranslatedTimeAgo(locale: LOCALE, date: string): string;
export declare const getTranslatedAndOthers: (basePath: LOCALE, count: number) => string;
