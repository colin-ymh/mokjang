import { BLANK } from '@/constants/constant';
import { DEFAULT_GROUP, Group } from '@/models/management/management';

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
}

export enum ACTION {
  READ = 'read',
  WRITE = 'write',
}

export type PermissionUnit = {
  id: string;
  domain: DOMAIN;
  action: ACTION;
};

export const DEFAULT_PERMISSION_UNIT: PermissionUnit = {
  id: BLANK,
  domain: DOMAIN.MEMBER,
  action: ACTION.READ,
};

export type PermissionTemplate = {
  id: string;
  churchId: string;
  title: string;
  memberCount: number;
  unitIds: string[];
  permissionUnits: PermissionUnit[];
};

export const DEFAULT_PERMISSION_TEMPLATE: PermissionTemplate = {
  id: BLANK,
  churchId: BLANK,
  title: BLANK,
  unitIds: [],
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
