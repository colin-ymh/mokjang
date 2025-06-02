import { HEADER_BAR } from '@/constants/constant';

export enum HOME_CONTENT_ID {
  HOME = 'home',
}

export enum MEMBER_CONTENT_ID {
  ALL = HEADER_BAR.ALL,
  ADMINISTRATOR = 'administrator',
  NEW = 'new',
}

export enum CHURCH_CONTENT_ID {
  GROUP = 'group',
  OFFICER = 'officer',
  MINISTRY = 'ministry',
}

export enum USER_CONTENT_ID {
  USER = 'user',
}

export enum ADMINISTRATOR_CONTENT_ID {
  ADMINISTRATOR = 'administrator',
}

export enum PERMISSION_CONTENT_ID {
  PERMISSION = 'permission',
}

export enum JOIN_REQUEST_CONTENT_ID {
  JOIN_REQUEST = 'join',
}

export enum VISITATION_CONTENT_ID {
  ALL = HEADER_BAR.ALL,
  MY = HEADER_BAR.MY,
  REPORTED = HEADER_BAR.REPORTED,
}

export enum TASK_CONTENT_ID {
  ALL = HEADER_BAR.ALL,
  MY = HEADER_BAR.MY,
  REPORTED = HEADER_BAR.REPORTED,
}

export enum EDUCATION_CONTENT_ID {
  ALL = HEADER_BAR.ALL,
  IN_PROGRESS = 'inProgress',
  TERM = 'term',
}
