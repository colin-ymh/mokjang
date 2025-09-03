import { BLANK } from '../../constants/constant';
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
  CHURCH = 'church',
  MANAGER = 'manager',
}

export type PERMISSION_DOMAIN =
  | DOMAIN.MEMBER
  | DOMAIN.VISITATION
  | DOMAIN.EDUCATION
  | DOMAIN.TASK
  | DOMAIN.CHURCH
  | DOMAIN.MANAGER;

export enum ACTION {
  READ = 'read',
  WRITE = 'write',
}

export type PermissionUnit = {
  id: string;
  domain: PERMISSION_DOMAIN;
  action: ACTION;
};

export type PermissionTemplate = {
  id: string;
  churchId: string;
  title: string;
  description: string;
  memberCount: number;
  unitIds: string[];
  permissionUnits: PermissionUnit[];
};

export const DEFAULT_PERMISSION_TEMPLATE: PermissionTemplate = {
  id: BLANK,
  churchId: BLANK,
  title: BLANK,
  description: BLANK,
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
