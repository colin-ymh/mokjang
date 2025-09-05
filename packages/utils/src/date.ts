import { BLANK, DAY, REPEAT_PERIOD } from '@mokjang/constants';

/**
 * YYYY-MM-DD => Date Object (UTC기준)
 * @param dateString
 */
export const getDateFromInput = (dateString: string) => {
  const lengthLimit = 10;
  const limited = dateString.slice(0, lengthLimit);

  // UTC 자정으로 맞추기
  return new Date(limited);
};

/**
 * Date Object => minute
 * @param date
 */
export const getTotalMinuteFromDate = (date: Date) => {
  const hour = date.getHours();
  const minute = date.getMinutes();

  return hour * 60 + minute;
};

/**
 * YYYY-MM-DDTHH:mm => Date Object
 * @param dateString
 */
export const getDateFromDateString = (dateString: string) => {
  return new Date(dateString);
};

/**
 * Date Object => YYYY-MM-dd
 * @param date
 */
export const getDateStringFromDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based index이므로 +1
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Date Object => MM/DD
 * @param date
 */
export const getMonthDateFromDate = (date: Date) => {
  const month = String(date.getMonth() + 1); // 0-based index이므로 +1
  const day = String(date.getDate());

  return `${month}/${day}`;
};

/**
 * Date Object => HH:mm
 * @param date
 */
export const getTimeStringFromDate = (date: Date) => {
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${hour}:${minute}`;
};

/**
 * Date Object => YYYY-MM-ddTHH:mm:ss
 * @param date
 */
export const getFullStringFromDate = (date: Date) => {
  if (!date) return BLANK;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based index이므로 +1
  const day = String(date.getDate()).padStart(2, '0');

  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}:00`;
};

/**
 * 사용자의 생년월일 date object를 통해 미성년자인지 확인
 * @param date
 * @return {boolean}
 */
export const getIsChild = (date: Date): boolean => {
  const CURRENT_YEAR = new Date().getFullYear();
  const TARGET_YEAR = date.getFullYear();

  return CURRENT_YEAR - TARGET_YEAR <= 18;
};

// 세는 나이 (한국식 나이) 계산
export const getAge = (date: Date | null): number => {
  if (!date) return 0;

  const today = new Date();
  const birthDate = new Date(date);

  // 세는 나이: 태어난 해를 1살로 하고, 해가 바뀔 때마다 1살씩 증가
  return today.getFullYear() - birthDate.getFullYear() + 1;
};

/**
 * 한 달 전의 날짜를 "YYYY-MM-DD" 문자열로 반환
 */
export const getNewMemberDate = (): string => {
  const today = new Date();
  // 현재 달에서 -1
  today.setMonth(today.getMonth() - 1);

  const year = today.getFullYear();
  // JS Date의 month는 0부터 시작하므로 +1
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  // yyyy-mm-dd 형태로 반환
  return `${year}-${month}-${day}`;
};

/**
 * second 를 mm:ss 형식으로 변경
 */
export const getMinuteFromSecond = (target: number) => {
  const minute = String(Math.floor(target / 60)).padStart(2, '0');
  const second = String(target % 60).padStart(2, '0');

  return `${minute}:${second}`;
};

/**
 * minute 를 hh:mm 형식으로 변경
 */
export const getHourFromMinute = (target: number) => {
  const hour = String(Math.floor(target / 60)).padStart(2, '0');
  const minute = String(target % 60).padStart(2, '0');

  return `${hour}:${minute}`;
};

/**
 * N개월 후 날짜 반환
 * @param date - 기준 날짜
 * @param months - 추가할 개월 수
 * @returns N개월 후 날짜
 */
export const getMonthsAfterDate = (date: Date, months: number): Date => {
  const result = new Date(date);
  const originalDay = result.getDate();

  result.setMonth(result.getMonth() + months);

  if (result.getDate() !== originalDay) {
    result.setDate(0);
  }

  return result;
};

/**
 * N개월 전 날짜 반환
 * @param date - 기준 날짜
 * @param months - 뺄 개월 수
 * @returns N개월 전 날짜
 */
export const getMonthsBeforeDate = (date: Date, months: number): Date => {
  const result = new Date(date);
  const originalDay = result.getDate();

  result.setMonth(result.getMonth() - months);

  if (result.getDate() !== originalDay) {
    result.setDate(0);
  }

  return result;
};

/**
 * StartDate 를 기준으로 출석부 행에 들어갈 세션 날짜 계산
 * @param startDate
 * @param endDate
 * @param worshipDay
 * @param repeatPeriod
 */
export const getWorshipSessionDates = (
  startDate: Date,
  endDate: Date,
  worshipDay: number,
  repeatPeriod: number
): Date[] => {
  const dates: Date[] = [];

  // startDate 이후로 가장 가까운 worshipDay의 날짜 계산
  const startDay = startDate.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
  const daysAhead = (worshipDay - startDay + 7) % 7;

  const sessionStartDate = new Date(startDate);
  if (daysAhead === 0) {
    // startDate가 이미 worshipDay인 경우
    sessionStartDate.setTime(startDate.getTime());
  } else {
    // 다음 worshipDay 까지의 날짜 추가
    sessionStartDate.setDate(startDate.getDate() + daysAhead);
  }

  // sessionStartDate 부터 repeatPeriod * 7일씩 더하면서 날짜 추가
  let currentDate = new Date(sessionStartDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate)); // 새로운 Date 객체로 복사하여 추가
    currentDate.setDate(currentDate.getDate() + repeatPeriod * 7);
  }

  return dates;
};

export const getIsSameDate = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * 특정 날짜와 요일 인덱스를 통해 해당 주차의 해당 요일 날짜를 반환
 * @param date
 * @param dayOfWeek
 */
export const getDateInWeekByDayOfWeek = (
  date: Date,
  dayOfWeek: number
): Date => {
  const selectedDayOfWeek = date.getDay();
  const daysDifference = dayOfWeek - selectedDayOfWeek;
  const targetDate = new Date(date);
  targetDate.setDate(date.getDate() + daysDifference);
  return targetDate;
};

export const getLastSunday = (): Date => {
  const today = new Date();
  const day = today.getDay(); // 0 (일) ~ 6 (토)
  const diff = day; // 오늘이 일요일이면 0
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - diff);
  lastSunday.setHours(0, 0, 0, 0); // 시간 초기화
  return lastSunday;
};

export const getDayConstantByIndex = (dayIndex: number) => {
  switch (dayIndex) {
    case 0:
      return DAY.SUNDAY;
    case 1:
      return DAY.MONDAY;
    case 2:
      return DAY.TUESDAY;
    case 3:
      return DAY.WEDNESDAY;
    case 4:
      return DAY.THURSDAY;
    case 5:
      return DAY.FRIDAY;
    case 6:
      return DAY.SATURDAY;
  }
};

export const getWeekRepeatConstant = (number: number) => {
  switch (number) {
    case 1:
      return REPEAT_PERIOD.EVERY_WEEK;
    case 2:
      return REPEAT_PERIOD.EVERY_OTHER_WEEK;
  }
};

export const getDateGap = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime()); // 밀리초 차이
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 일 단위로 변환
  return diffDays;
};
