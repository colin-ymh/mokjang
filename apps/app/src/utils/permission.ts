import {
  PermissionScope,
  PermissionTemplate,
  PermissionUnit,
} from '../models/permission/permission';
import { CHURCH_USER_ROLE } from '../constants/constant';
import { BLANK } from '@mokjang/constants';

/**
 * 소유자 권한 유형 생성하기
 * @param t
 * @param churchId
 * @param permissionUnits
 */
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
    description: BLANK,
  };
  return ownerPermissionTemplate;
};

export const getPermissionScopeTitle = (
  t: (key: string, ...args: any[]) => string,
  scopes: PermissionScope[]
) => {
  if (!scopes || scopes?.length === 0) {
    return t('none');
  } else if (scopes.length === 1) {
    if (scopes[0].isAllGroups) {
      return t('all');
    } else {
      return scopes[0].group.name;
    }
  } else {
    const title = scopes[0].group.name;
    const count = scopes.length - 1;

    return `${title} + ${count}`;
  }
};
