import {
  ACTION,
  DOMAIN,
  PERMISSION_DOMAIN,
  PermissionScope,
  PermissionTemplate,
  PermissionUnit,
} from '@mokjang/models';
import { BLANK, CHURCH_USER_ROLE } from '@mokjang/constants';
import { RootState } from '@/redux/store';

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

export const getPermissionUnitId = (
  domain: PERMISSION_DOMAIN,
  action: ACTION
): number => {
  switch (domain) {
    case DOMAIN.MEMBER:
      if (action === ACTION.READ) {
        return 1;
      } else if (action === ACTION.WRITE) {
        return 2;
      }
      break;
    case DOMAIN.VISITATION:
      if (action === ACTION.READ) {
        return 3;
      } else if (action === ACTION.WRITE) {
        return 4;
      }
      break;
    case DOMAIN.EDUCATION:
      if (action === ACTION.READ) {
        return 5;
      } else if (action === ACTION.WRITE) {
        return 6;
      }
      break;
    case DOMAIN.TASK:
      if (action === ACTION.READ) {
        return 7;
      } else if (action === ACTION.WRITE) {
        return 8;
      }
      break;
    case DOMAIN.WORSHIP:
      if (action === ACTION.READ) {
        return 9;
      } else if (action === ACTION.WRITE) {
        return 10;
      }
      break;
    case DOMAIN.MANAGEMENT:
      if (action === ACTION.READ) {
        return 11;
      } else if (action === ACTION.WRITE) {
        return 12;
      }
      break;
    case DOMAIN.PERMISSION:
      if (action === ACTION.READ) {
        return 13;
      } else if (action === ACTION.WRITE) {
        return 14;
      }
      break;
    case DOMAIN.WORSHIP_ATTENDANCE:
      if (action === ACTION.READ) {
        return 15;
      } else if (action === ACTION.WRITE) {
        return 16;
      }
      break;
    default:
      return 0;
  }
  return 0;
};

// 순수 함수: user를 인자로 받는다 (컴포넌트에서 useSelector 후 전달).
// 내부에서 훅을 호출하지 않아 rules-of-hooks 위반이 없다.
export const getIsAccessed = (
  user: RootState['user']['user'],
  domain: PERMISSION_DOMAIN,
  action: ACTION
) => {
  if (user.churchUser[0]?.role === CHURCH_USER_ROLE.OWNER) return true;

  const unitId = getPermissionUnitId(domain, action);
  if (!unitId) return false;

  return (
    user.churchUser[0]?.permissionTemplate?.permissionUnits?.length > 0 &&
    user.churchUser[0].permissionTemplate?.permissionUnits.some(
      (unit) => unit.id == unitId
    )
  );
};
