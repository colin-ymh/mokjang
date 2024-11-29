export const NONE = "none";

// 신급
export enum BAPTISM {
  BAPTIZED = "baptized",
  IMMERSION_BAPTISM = "immersionBaptism",
  INFANT_BAPTISM = "infantBaptism",
  CATECHUMENATE = "catechumenate",
}

// 신급
export enum CONFIRMATION {
  ELDER = "elder",
  EXHORTER = "exhorter",
  ORDAINED_DEACON = "ordainedDeacon",
  DEACON = "deacon",
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
