import { BLANK } from '@/constants/constant';

export enum DOMAIN {
  MEMBER = 'member',
  VISITATION = 'visitation',
  TASK = 'task',
  EDUCATION = 'education',
  OFFICER = 'officer',
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
