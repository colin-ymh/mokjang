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

export enum ADMINISTRATOR_CONTENT_ID {
  SETTING = 'setting',
  ADD = 'add',
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
