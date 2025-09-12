import { BLANK } from '@mokjang/constants';
import { DEFAULT_GROUP, Group } from '../management/management';

export enum DOMAIN {
  MEMBER = 'member',
  VISITATION = 'visitation',
  TASK = 'task',
  EDUCATION = 'education',
  EDUCATION_TERM = 'educationTerm',
  EDUCATION_SESSION = 'educationSession',
  MANAGEMENT = 'management',
  HOLIDAY = 'holiday',
  CHURCH_EVENT = 'churchEvent',
  WORSHIP = 'workshop',
  PERMISSION = 'permission',
}

export type CALENDAR_DOMAIN =
  | DOMAIN.MEMBER
  | DOMAIN.VISITATION
  | DOMAIN.EDUCATION_SESSION
  | DOMAIN.TASK
  | DOMAIN.CHURCH_EVENT
  | DOMAIN.HOLIDAY;

export type PERMISSION_DOMAIN =
  | DOMAIN.MEMBER
  | DOMAIN.VISITATION
  | DOMAIN.EDUCATION
  | DOMAIN.TASK
  | DOMAIN.WORSHIP
  | DOMAIN.MANAGEMENT
  | DOMAIN.PERMISSION;

export enum ACTION {
  READ = 'read',
  WRITE = 'write',
}

export type PermissionUnit = {
  id: number;
  domain: PERMISSION_DOMAIN;
  action: ACTION;
};

export type PermissionTemplate = {
  id: string;
  churchId: string;
  title: string;
  description: string;
  memberCount: number;
  unitIds: number[];
  permissionUnits: PermissionUnit[];
};

export const DEFAULT_PERMISSION_TEMPLATE: PermissionTemplate = {
  id: BLANK,
  churchId: BLANK,
  title: BLANK,
  description: BLANK,
  unitIds: [11],
  memberCount: 0,
  permissionUnits: [],
};

export type PermissionScope = {
  id: string;
  isAllGroups: boolean;
  group: Group;
};

export const DEFAULT_PERMISSION_SCOPE: PermissionScope = {
  id: BLANK,
  isAllGroups: false,
  group: DEFAULT_GROUP,
};
