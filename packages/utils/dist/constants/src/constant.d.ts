export declare const BLANK = "";
export declare const ALL = "all";
export declare enum DAY {
    SUNDAY = "sunday",
    MONDAY = "monday",
    TUESDAY = "tuesday",
    WEDNESDAY = "wednesday",
    THURSDAY = "thursday",
    FRIDAY = "friday",
    SATURDAY = "saturday"
}
export declare const DAYS: DAY[];
export declare enum BAPTISM {
    NONE = "none",
    BAPTIZED = "baptized",
    IMMERSION_BAPTISM = "immersionBaptism",
    INFANT_BAPTISM = "infantBaptism",
    CATECHUMENATE = "catechumenate",
    CONFIRMATION = "confirmation"
}
export declare enum GENDER {
    MALE = "male",
    FEMALE = "female"
}
export declare enum MARRIAGE {
    MARRIED = "married",// 기혼
    SINGLE = "single"
}
export declare enum FAMILY {
    FAMILY = "family",// 가족
    SPOUSE = "spouse",// 배우자
    FATHER = "father",// 아버지
    MOTHER = "mother",// 어머니
    SON = "son",// 아들
    DAUGHTER = "daughter",// 딸
    BROTHER = "brother",// 형제
    SISTER = "sister",// 자매
    SIBLING = "sibling",// 남매
    GRANDFATHER = "grandfather",// 할아버지
    GRANDMOTHER = "grandmother",// 할머니
    SON_IN_LAW = "sonInLaw",// 사위
    DAUGHTER_IN_LAW = "daughterInLaw",// 며느리
    HUSBAND_FATHER_IN_LAW = "husbandFatherInLaw",// 시부
    HUSBAND_MOTHER_IN_LAW = "husbandMotherInLaw",// 시모
    WIFE_FATHER_IN_LAW = "wifeFatherInLaw",// 장인
    WIFE_MOTHER_IN_LAW = "wifeMotherInLaw",// 장모
    GRANDSON = "grandson",// 손자
    GRANDDAUGHTER = "granddaughter",// 손녀
    RELATIVE = "relative"
}
export declare enum CALENDAR_MODE {
    SOLAR = "solar",
    LUNAR = "lunar"
}
export declare enum MEDIA {
    MOBILE = "mobile",
    TABLET = "tablet",
    DESKTOP = "desktop"
}
export declare enum MEDIA_MIN_WIDTH {
    MOBILE = "320px",
    TABLET = "768px",
    DESKTOP = "1024px"
}
export declare enum MEDIA_MAX_WIDTH {
    MOBILE = "767px",// TABLET 시작점 - 1
    TABLET = "1023px",// DESKTOP 시작점 - 1
    DESKTOP = "100vw"
}
export declare enum ORDER_DIRECTION {
    ASC = "ASC",
    DESC = "DESC"
}
export declare enum HEADER_BAR {
    ALL = "all",
    MY = "my",
    REPORTED = "reported"
}
export declare enum USER_ROLE {
    OWNER = "owner",
    MEMBER = "member",
    NONE = "none"
}
export declare enum CHURCH_USER_ROLE {
    OWNER = "owner",
    MANAGER = "manager",
    MEMBER = "member"
}
export declare enum WORSHIP_PERIOD {
    CUSTOM = "customSelect",
    THIS_WEEK = "thisWeek",
    THIS_MONTH = "thisMonth",
    LAST_MONTH = "lastMonth",
    LAST_THREE_MONTH = "lastThreeMonth"
}
export declare enum HOME_WIDGET {
    MY_SCHEDULE = "mySchedule",
    REPORTED_SCHEDULE = "reportedSchedule",
    MY_SCHEDULE_SUMMARY = "myScheduleSummary",
    CHURCH_SCHEDULE_SUMMARY = "churchScheduleSummary",
    NEW_MEMBER = "newMember",
    WORSHIP_ATTENDANCE = "worshipAttendance"
}
export declare enum DND_ITEM_TYPE {
    GROUP = "group",
    HOME_WIDGET = "homeWidget",
    TABLE_HEADER = "tableHeader"
}
export declare enum HOVER_POSITION {
    TOP = "top",
    MIDDLE = "middle",
    BOTTOM = "bottom"
}
export declare enum RANGE {
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTER = "quarter",
    HALF = "half"
}
export declare enum GROUP_ROLE {
    NONE = "none",
    LEADER = "leader"
}
export declare enum MINISTRY_GROUP_ROLE {
    NONE = "none",
    LEADER = "leader"
}
export declare enum HISTORY {
    GROUP = "group",
    MINISTRY = "ministry",
    EDUCATION = "education",
    OFFICER = "officer"
}
export declare enum REPEAT_PERIOD {
    EVERY_WEEK = "everyWeek",
    EVERY_OTHER_WEEK = "everyOtherWeek"
}
