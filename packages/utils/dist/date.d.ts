import { DAY, REPEAT_PERIOD } from '@mokjang/constants';
/**
 * YYYY-MM-DD => Date Object (UTC기준)
 * @param dateString
 */
export declare const getDateFromInput: (dateString: string) => Date;
/**
 * Date Object => minute
 * @param date
 */
export declare const getTotalMinuteFromDate: (date: Date) => number;
/**
 * YYYY-MM-DDTHH:mm => Date Object
 * @param dateString
 */
export declare const getDateFromDateString: (dateString: string) => Date;
/**
 * Date Object => YYYY-MM-dd
 * @param date
 */
export declare const getDateStringFromDate: (date: Date) => string;
/**
 * Date Object => MM/DD
 * @param date
 */
export declare const getMonthDateFromDate: (date: Date) => string;
/**
 * Date Object => HH:mm
 * @param date
 */
export declare const getTimeStringFromDate: (date: Date) => string;
/**
 * Date Object => YYYY-MM-ddTHH:mm:ss
 * @param date
 */
export declare const getFullStringFromDate: (date: Date) => string;
/**
 * 사용자의 생년월일 date object를 통해 미성년자인지 확인
 * @param date
 * @return {boolean}
 */
export declare const getIsChild: (date: Date) => boolean;
export declare const getAge: (date: Date) => number;
/**
 * 한 달 전의 날짜를 "YYYY-MM-DD" 문자열로 반환
 */
export declare const getNewMemberDate: () => string;
/**
 * second 를 mm:ss 형식으로 변경
 */
export declare const getMinuteFromSecond: (target: number) => string;
/**
 * minute 를 hh:mm 형식으로 변경
 */
export declare const getHourFromMinute: (target: number) => string;
/**
 * N개월 후 날짜 반환
 * @param date - 기준 날짜
 * @param months - 추가할 개월 수
 * @returns N개월 후 날짜
 */
export declare const getMonthsAfterDate: (date: Date, months: number) => Date;
/**
 * N개월 전 날짜 반환
 * @param date - 기준 날짜
 * @param months - 뺄 개월 수
 * @returns N개월 전 날짜
 */
export declare const getMonthsBeforeDate: (date: Date, months: number) => Date;
/**
 * StartDate 를 기준으로 출석부 행에 들어갈 세션 날짜 계산
 * @param startDate
 * @param endDate
 * @param worshipDay
 * @param repeatPeriod
 */
export declare const getWorshipSessionDates: (startDate: Date, endDate: Date, worshipDay: number, repeatPeriod: number) => Date[];
export declare const getIsSameDate: (date1: Date, date2: Date) => boolean;
/**
 * 특정 날짜와 요일 인덱스를 통해 해당 주차의 해당 요일 날짜를 반환
 * @param date
 * @param dayOfWeek
 */
export declare const getDateInWeekByDayOfWeek: (date: Date, dayOfWeek: number) => Date;
export declare const getLastSunday: () => Date;
export declare const getDayConstantByIndex: (dayIndex: number) => DAY | undefined;
export declare const getWeekRepeatConstant: (number: number) => REPEAT_PERIOD | undefined;
export declare const getDateGap: (date1: Date, date2: Date) => number;
