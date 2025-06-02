import { BLANK } from '@/constants/constant';

export enum DOMAIN {
  MEMBER = 'member',
  VISITATION = 'visitation',
  TASK = 'task',
  EDUCATION = 'education',
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
  name: string;
  unitIds: string[];
};

export const DEFAULT_PERMISSION_TEMPLATE: PermissionTemplate = {
  id: BLANK,
  name: BLANK,
  unitIds: [],
};
