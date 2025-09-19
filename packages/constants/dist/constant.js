export const BLANK = '';
export const ALL = 'all';
export const CONCEALED = 'CONCEALED';
export var DAY;
(function (DAY) {
    DAY["SUNDAY"] = "sunday";
    DAY["MONDAY"] = "monday";
    DAY["TUESDAY"] = "tuesday";
    DAY["WEDNESDAY"] = "wednesday";
    DAY["THURSDAY"] = "thursday";
    DAY["FRIDAY"] = "friday";
    DAY["SATURDAY"] = "saturday";
})(DAY || (DAY = {}));
export const DAYS = Object.values(DAY);
// 신급
export var BAPTISM;
(function (BAPTISM) {
    BAPTISM["none"] = "none";
    BAPTISM["NONE"] = "baptismNone";
    BAPTISM["BAPTIZED"] = "baptized";
    BAPTISM["IMMERSION_BAPTISM"] = "immersionBaptism";
    BAPTISM["INFANT_BAPTISM"] = "infantBaptism";
    BAPTISM["CATECHUMENATE"] = "catechumenate";
    BAPTISM["CONFIRMATION"] = "confirmation";
})(BAPTISM || (BAPTISM = {}));
// 성별
export var GENDER;
(function (GENDER) {
    GENDER["MALE"] = "male";
    GENDER["FEMALE"] = "female";
})(GENDER || (GENDER = {}));
// 결혼 상태
export var MARRIAGE;
(function (MARRIAGE) {
    MARRIAGE["MARRIED"] = "married";
    MARRIAGE["SINGLE"] = "single";
    MARRIAGE["NONE"] = "marriageNone";
})(MARRIAGE || (MARRIAGE = {}));
// 가족 관계
export var FAMILY;
(function (FAMILY) {
    FAMILY["FAMILY"] = "family";
    FAMILY["SPOUSE"] = "spouse";
    FAMILY["FATHER"] = "father";
    FAMILY["MOTHER"] = "mother";
    FAMILY["SON"] = "son";
    FAMILY["DAUGHTER"] = "daughter";
    FAMILY["BROTHER"] = "brother";
    FAMILY["SISTER"] = "sister";
    FAMILY["SIBLING"] = "sibling";
    FAMILY["GRANDFATHER"] = "grandfather";
    FAMILY["GRANDMOTHER"] = "grandmother";
    FAMILY["SON_IN_LAW"] = "sonInLaw";
    FAMILY["DAUGHTER_IN_LAW"] = "daughterInLaw";
    FAMILY["HUSBAND_FATHER_IN_LAW"] = "husbandFatherInLaw";
    FAMILY["HUSBAND_MOTHER_IN_LAW"] = "husbandMotherInLaw";
    FAMILY["WIFE_FATHER_IN_LAW"] = "wifeFatherInLaw";
    FAMILY["WIFE_MOTHER_IN_LAW"] = "wifeMotherInLaw";
    FAMILY["GRANDSON"] = "grandson";
    FAMILY["GRANDDAUGHTER"] = "granddaughter";
    FAMILY["RELATIVE"] = "relative";
})(FAMILY || (FAMILY = {}));
// 양력 음력
export var CALENDAR_MODE;
(function (CALENDAR_MODE) {
    CALENDAR_MODE["SOLAR"] = "solar";
    CALENDAR_MODE["LUNAR"] = "lunar";
})(CALENDAR_MODE || (CALENDAR_MODE = {}));
// 모바일, 태블릿, 데스크톱
export var MEDIA;
(function (MEDIA) {
    MEDIA["MOBILE"] = "mobile";
    MEDIA["TABLET"] = "tablet";
    MEDIA["DESKTOP"] = "desktop";
})(MEDIA || (MEDIA = {}));
export var MEDIA_MIN_WIDTH;
(function (MEDIA_MIN_WIDTH) {
    MEDIA_MIN_WIDTH["MOBILE"] = "320px";
    MEDIA_MIN_WIDTH["TABLET"] = "768px";
    MEDIA_MIN_WIDTH["DESKTOP"] = "1024px";
})(MEDIA_MIN_WIDTH || (MEDIA_MIN_WIDTH = {}));
export var MEDIA_MAX_WIDTH;
(function (MEDIA_MAX_WIDTH) {
    MEDIA_MAX_WIDTH["MOBILE"] = "767px";
    MEDIA_MAX_WIDTH["TABLET"] = "1023px";
    MEDIA_MAX_WIDTH["DESKTOP"] = "100vw";
})(MEDIA_MAX_WIDTH || (MEDIA_MAX_WIDTH = {}));
// 오름차순/내림차순
export var ORDER_DIRECTION;
(function (ORDER_DIRECTION) {
    ORDER_DIRECTION["ASC"] = "ASC";
    ORDER_DIRECTION["DESC"] = "DESC";
})(ORDER_DIRECTION || (ORDER_DIRECTION = {}));
export var HEADER_BAR;
(function (HEADER_BAR) {
    HEADER_BAR["ALL"] = "all";
    HEADER_BAR["MY"] = "my";
    HEADER_BAR["REPORTED"] = "reported";
})(HEADER_BAR || (HEADER_BAR = {}));
export var USER_ROLE;
(function (USER_ROLE) {
    USER_ROLE["OWNER"] = "owner";
    USER_ROLE["MEMBER"] = "member";
    USER_ROLE["NONE"] = "none";
})(USER_ROLE || (USER_ROLE = {}));
export var CHURCH_USER_ROLE;
(function (CHURCH_USER_ROLE) {
    CHURCH_USER_ROLE["OWNER"] = "owner";
    CHURCH_USER_ROLE["MANAGER"] = "manager";
    CHURCH_USER_ROLE["MEMBER"] = "member";
})(CHURCH_USER_ROLE || (CHURCH_USER_ROLE = {}));
export var WORSHIP_PERIOD;
(function (WORSHIP_PERIOD) {
    WORSHIP_PERIOD["CUSTOM"] = "customSelect";
    WORSHIP_PERIOD["THIS_WEEK"] = "thisWeek";
    WORSHIP_PERIOD["THIS_MONTH"] = "thisMonth";
    WORSHIP_PERIOD["LAST_MONTH"] = "lastMonth";
    WORSHIP_PERIOD["LAST_THREE_MONTH"] = "lastThreeMonth";
})(WORSHIP_PERIOD || (WORSHIP_PERIOD = {}));
export var HOME_WIDGET;
(function (HOME_WIDGET) {
    HOME_WIDGET["MY_SCHEDULE"] = "mySchedule";
    HOME_WIDGET["REPORTED_SCHEDULE"] = "reportedSchedule";
    HOME_WIDGET["MY_SCHEDULE_SUMMARY"] = "myScheduleSummary";
    HOME_WIDGET["CHURCH_SCHEDULE_SUMMARY"] = "churchScheduleSummary";
    HOME_WIDGET["NEW_MEMBER"] = "newMember";
    HOME_WIDGET["WORSHIP_ATTENDANCE"] = "worshipAttendance";
})(HOME_WIDGET || (HOME_WIDGET = {}));
export var DND_ITEM_TYPE;
(function (DND_ITEM_TYPE) {
    DND_ITEM_TYPE["GROUP"] = "group";
    DND_ITEM_TYPE["HOME_WIDGET"] = "homeWidget";
    DND_ITEM_TYPE["TABLE_HEADER"] = "tableHeader";
})(DND_ITEM_TYPE || (DND_ITEM_TYPE = {}));
export var HOVER_POSITION;
(function (HOVER_POSITION) {
    HOVER_POSITION["TOP"] = "top";
    HOVER_POSITION["MIDDLE"] = "middle";
    HOVER_POSITION["BOTTOM"] = "bottom";
})(HOVER_POSITION || (HOVER_POSITION = {}));
export var RANGE;
(function (RANGE) {
    RANGE["WEEKLY"] = "weekly";
    RANGE["MONTHLY"] = "monthly";
    RANGE["QUARTER"] = "quarter";
    RANGE["HALF"] = "half";
})(RANGE || (RANGE = {}));
export var GROUP_ROLE;
(function (GROUP_ROLE) {
    GROUP_ROLE["NONE"] = "none";
    GROUP_ROLE["LEADER"] = "leader";
})(GROUP_ROLE || (GROUP_ROLE = {}));
export var MINISTRY_GROUP_ROLE;
(function (MINISTRY_GROUP_ROLE) {
    MINISTRY_GROUP_ROLE["NONE"] = "none";
    MINISTRY_GROUP_ROLE["LEADER"] = "leader";
})(MINISTRY_GROUP_ROLE || (MINISTRY_GROUP_ROLE = {}));
export var HISTORY;
(function (HISTORY) {
    HISTORY["GROUP"] = "group";
    HISTORY["MINISTRY"] = "ministry";
    HISTORY["EDUCATION"] = "education";
    HISTORY["OFFICER"] = "officer";
})(HISTORY || (HISTORY = {}));
export var REPEAT_PERIOD;
(function (REPEAT_PERIOD) {
    REPEAT_PERIOD["EVERY_WEEK"] = "everyWeek";
    REPEAT_PERIOD["EVERY_OTHER_WEEK"] = "everyOtherWeek";
})(REPEAT_PERIOD || (REPEAT_PERIOD = {}));
