export const NONE = 'none'; // 없음 이라는 값
export const BLANK = '';
export const NULL = 'null'; // 진짜로 없는 값

// 신급
export enum BAPTISM {
  BAPTIZED = 'baptized',
  IMMERSION_BAPTISM = 'immersionBaptism',
  INFANT_BAPTISM = 'infantBaptism',
  CATECHUMENATE = 'catechumenate',
  CONFIRMATION = 'confirmation',
  NONE = 'none',
}

// 성도 등록 타입
export enum MEMBER_REGISTER_TYPE {
  NEW = 'new',
  TRANSFERRED = 'transferred',
}

// 성도 등록 단계
export enum MEMBER_REGISTER_STAGE {
  REQUIRED = 'required',
  PERSONAL = 'personal',
  RELIGIOUS = 'religious',
  EDIT = 'edit',
}

// 성별
export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
}

// 결혼 상태
export enum MARRIAGE {
  MARRIED = 'married', // 기혼
  SINGLE = 'single', // 미혼
}

// 가족 관계
export enum FAMILY {
  FAMILY = 'family', // 가족
  SPOUSE = 'spouse', // 배우자
  FATHER = 'father', // 아버지
  MOTHER = 'mother', // 어머니
  SON = 'son', // 아들
  DAUGHTER = 'daughter', // 딸
  BROTHER = 'brother', // 형제
  SISTER = 'sister', // 자매
  SIBLING = 'sibling', // 남매
  GRANDFATHER = 'grandfather', // 할아버지
  GRANDMOTHER = 'grandmother', // 할머니
  SON_IN_LAW = 'sonInLaw', // 사위
  DAUGHTER_IN_LAW = 'daughterInLaw', // 며느리
  HUSBAND_FATHER_IN_LAW = 'husbandFatherInLaw', // 시부
  HUSBAND_MOTHER_IN_LAW = 'husbandMotherInLaw', // 시모
  WIFE_FATHER_IN_LAW = 'wifeFatherInLaw', // 장인
  WIFE_MOTHER_IN_LAW = 'wifeMotherInLaw', // 장모
  GRANDSON = 'grandson', // 손자
  GRANDDAUGHTER = 'granddaughter', // 손녀
  RELATIVE = 'relative', // 친인척
}

// 양력 음력
export enum CALENDAR_MODE {
  SOLAR = 'solar',
  LUNAR = 'lunar',
}

// 모바일, 태블릿, 데스크톱
export enum MEDIA {
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
}

export enum MEDIA_MIN_WIDTH {
  MOBILE = '320px',
  TABLET = '768px',
  DESKTOP = '1024px',
}

export enum MEDIA_MAX_WIDTH {
  MOBILE = '767px', // TABLET 시작점 - 1
  TABLET = '1023px', // DESKTOP 시작점 - 1
  DESKTOP = '100vw', // 최댓값 (디폴트로 설정 가능)
}

// 오름차순/내림차순
export enum ORDER_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

export enum HEADER_BAR {
  ALL = 'all',
  MY = 'my',
  REPORTED = 'reported',
}

export enum USER_ROLE {
  OWNER = 'owner',
  MEMBER = 'member',
  NONE = 'none',
}

export enum CHURCH_USER_ROLE {
  OWNER = 'owner',
  MANAGER = 'manager',
  MEMBER = 'member',
}
