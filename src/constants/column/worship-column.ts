export enum WORSHIP {
  TITLE = 'title',
  DESCRIPTION = 'description',
  WORSHIP_DAY = 'worshipDay',
  REPEAT_PERIOD = 'repeaterPeriod',
}

export enum WORSHIP_ENROLLMENT {
  NAME = 'name',
  GROUP = 'group',
  ATTENDANCE_RATE = 'attendanceRate',
  WORSHIP_SESSION = 'worshipSession',

  WORSHIP = 'worship',
  FROM_DATE = 'fromSessionDate',
  TO_DATE = 'toSessionDate',

  ID = 'id',
  GROUP_NAME = 'groupName',
}

export enum WORSHIP_SESSION {
  TITLE = 'title',
  DESCRIPTION = 'description',
  DATE = 'date',

  WORSHIP = 'worship',
  FROM_DATE = 'fromSessionDate',
  TO_DATE = 'toSessionDate',
}

export enum WORSHIP_ATTENDANCE {
  NAME = 'name',
  PRESENT = 'present',
  ABSENT = 'absent',
  NOTE = 'note',

  ID = 'id',
  ATTENDANCE_STATUS = 'attendanceStatus',
  GROUP_NAME = 'groupName',
}
