import {
  PermissionTemplate,
  PermissionUnit,
} from '@/models/permission/permission';
import { CHURCH_USER_ROLE } from '@/constants/constant';

export const getOwnerPermissionTemplate = (
  t: (key: string, ...args: any[]) => string,
  churchId: string,
  permissionUnits: PermissionUnit[]
): PermissionTemplate => {
  const ownerPermissionTemplate: PermissionTemplate = {
    id: CHURCH_USER_ROLE.OWNER,
    churchId,
    title: t(CHURCH_USER_ROLE.OWNER),
    unitIds: permissionUnits.map((u) => u.id),
    memberCount: 1,
    permissionUnits,
  };
  return ownerPermissionTemplate;
};
