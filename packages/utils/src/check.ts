import { BLANK } from '@mokjang/constants';

export const getIsWellFormedMobilePhone = (mobilePhone: string) => {
  if (mobilePhone.slice(0, 3) !== '010') return false;

  return mobilePhone.length === 13;
};

export const getIsWellFormedEmail = (email: string): boolean => {
  // 공백 제거
  const trimmed = email.trim();

  // 기본 이메일 정규식: [문자열]@[문자열].[문자열]
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(trimmed);
};

const LOCAL_NUMBER = ['02', '03', '04', '05', '06'];
export const getIsWellFormedHomePhone = (mobilePhone: string) => {
  const FIRST_TWO = mobilePhone.slice(0, 2);
  const LENGTH = mobilePhone.length;

  // 지역번호가 틀리면 바로 false
  if (!LOCAL_NUMBER.includes(FIRST_TWO)) return false;

  // 서울 + 11자리 => true
  if (FIRST_TWO === '02' && LENGTH === 11) return true;

  // 그 외 + 12자리 => true
  // 나머지는 false
  return FIRST_TWO !== '02' && LENGTH === 12;
};

export const getIsWellFormedPhone = (phone: string) => {
  return getIsWellFormedMobilePhone(phone) || getIsWellFormedHomePhone(phone);
};

const THIRTY_ONE_MONTHS = new Set(['1', '3', '5', '7', '8', '10', '12']);
const THIRTY_MONTHS = new Set(['4', '6', '9', '11']);

export const getIsWellFormedBirth = (birth: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth)) return false; // YYYY-MM-DD 형식 검사

  const [YEAR, MONTH, DATE] = birth.split('-').map((v) => parseInt(v, 10));
  const TODAY = new Date();

  // 연도 검사
  if (YEAR > TODAY.getFullYear()) return false;
  if (YEAR === TODAY.getFullYear() && MONTH > TODAY.getMonth() + 1)
    return false;
  if (
    YEAR === TODAY.getFullYear() &&
    MONTH <= TODAY.getMonth() + 1 &&
    DATE > TODAY.getDate()
  )
    return false;

  // 월 검사
  if (MONTH < 1 || MONTH > 12) return false;

  // 일 검사
  if (DATE < 1) return false;

  if (THIRTY_ONE_MONTHS.has(MONTH.toString()) && DATE > 31) return false;
  if (THIRTY_MONTHS.has(MONTH.toString()) && DATE > 30) return false;

  // 2월 검사
  if (MONTH === 2) {
    // 윤년 여부
    const isLeapYear = (YEAR % 4 === 0 && YEAR % 100 !== 0) || YEAR % 400 === 0;
    if (DATE > (isLeapYear ? 29 : 28)) return false;
  }

  return true;
};

export const getIsWellFormedDate = (birth: string): boolean => {
  // YYYY-MM-DD 형식 검사
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth)) return false;

  const [YEAR, MONTH, DATE] = birth.split('-').map((v) => parseInt(v, 10));

  // 월 검사 (1 ~ 12 범위)
  if (MONTH < 1 || MONTH > 12) return false;

  // 윤년 여부 검사 함수
  const isLeapYear = (year: number): boolean =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  // 각 월별 최대 일자
  const daysInMonth = [
    31,
    isLeapYear(YEAR) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  // 일 검사 (월별 최대 일자 범위 내에 있어야 함)
  if (DATE < 1 || DATE > daysInMonth[MONTH - 1]) return false;

  return true;
};

export const getIsWellFormedName = (name: string) => {
  if (name === BLANK) return false;
  // 한글, 영문, 공백만 허용
  return /^[가-힣a-zA-Z\s]+$/g.test(name);
};

export const getIsWellFormedTitle = (name: string) => {
  if (name === BLANK) return false;
  // 한글, 영문, 공백만 허용
  return /^[가-힣a-zA-Z0-9\s]+$/g.test(name);
};

export const getIsWellFormedVehicleNumber = (
  vehicleNumber: string
): boolean => {
  if (!vehicleNumber) return false;

  // 숫자, 한글 완성, 한글 자모 외 문자가 있으면 false
  if (!/^[0-9ㄱ-ㅎㅏ-ㅣ가-힣]+$/.test(vehicleNumber)) return false;

  const chars = vehicleNumber.split('');
  const len = chars.length;

  let hangulIndex: number | null = null;
  let hasInvalid = false;

  chars.forEach((ch, i) => {
    const isDigit = /[0-9]/.test(ch);
    const isHangul = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(ch);

    if (i === 2 || i === 3) {
      // 한글 허용, 단 둘 중 하나만 가능
      if (isHangul) {
        if (hangulIndex !== null) hasInvalid = true;
        hangulIndex = i;
      } else if (!isDigit) {
        hasInvalid = true;
      }
    } else {
      // 나머지는 숫자만 허용
      if (!isDigit) hasInvalid = true;
    }
  });

  if (hasInvalid) return false;

  // 한글 위치에 따른 길이 제한
  if (hangulIndex === null) {
    // 숫자만 → 정확히 4자리
    return len === 4;
  } else if (hangulIndex === 2) {
    return len <= 7;
  } else if (hangulIndex === 3) {
    return len <= 8;
  }

  return false;
};

export const getIsWellFormedIdentifyNumber = (
  identifyNumber: string
): boolean => {
  const pattern = /^\d{3}-\d{2}-\d{4}-\d{1}$/;

  return pattern.test(identifyNumber);
};
