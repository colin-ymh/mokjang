export const NONE = "none"; // 없음 이라는 값
export const BLANK = "";
export const NULL = "null"; // 진짜로 없는 값

// 신급
export enum BAPTISM {
  BAPTIZED = "baptized",
  IMMERSION_BAPTISM = "immersionBaptism",
  INFANT_BAPTISM = "infantBaptism",
  CATECHUMENATE = "catechumenate",
  CONFIRMATION = "confirmation",
  NONE = "none",
}

// 성도 등록 타입
export enum MEMBER_REGISTER_TYPE {
  NEW = "new",
  TRANSFERRED = "transferred",
}

// 성도 등록 단계
export enum MEMBER_REGISTER_STAGE {
  REQUIRED = "required",
  PERSONAL = "personal",
  RELIGIOUS = "religious",
}

// 성별
export enum GENDER {
  MALE = "male",
  FEMALE = "female",
}

// 결혼 상태
export enum MARRIAGE {
  MARRIED = "married",
  SINGLE = "single",
}

// 양력 음력
export enum CALENDAR_MODE {
  SOLAR = "solar",
  LUNAR = "lunar",
}

// 모바일, 태블릿, 데스크톱
export enum MEDIA {
  MOBILE = "mobile",
  TABLET = "tablet",
  DESKTOP = "desktop",
}

export enum MEDIA_MIN_WIDTH {
  MOBILE = "320px",
  TABLET = "768px",
  DESKTOP = "1024px",
}

// 오름차순/내림차순
export enum ORDER_DIRECTION {
  ASC = "asc",
  DESC = "desc",
}
