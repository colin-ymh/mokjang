import { BLANK, CHURCH_USER_ROLE } from '@mokjang/constants';
import { DEFAULT_MEMBER, Member } from '../member/member';
import {
  DEFAULT_PERMISSION_TEMPLATE,
  PermissionScope,
  PermissionTemplate,
} from '../permission/permission';
import { DEFAULT_USER, User } from '../user/user';

export type ChurchUser = {
  id: string;
  createdAt: string;
  updatedAt: string;
  churchId: string;
  userId: string;
  memberId: string;
  role: CHURCH_USER_ROLE;
  permissionTemplateId: string;
  isPermissionActive: boolean;
  joinedAt: string;
  leftAt?: string;
  member: Member;
  user: User;
  permissionTemplate: PermissionTemplate;
  permissionScopes: PermissionScope[];
};

export const DEFAULT_CHURCH_USER: ChurchUser = {
  id: BLANK,
  createdAt: BLANK,
  updatedAt: BLANK,
  churchId: BLANK,
  userId: BLANK,
  memberId: BLANK,
  role: CHURCH_USER_ROLE.MEMBER,
  permissionTemplateId: BLANK,
  isPermissionActive: false,
  joinedAt: BLANK,
  member: DEFAULT_MEMBER,
  user: DEFAULT_USER,
  permissionTemplate: DEFAULT_PERMISSION_TEMPLATE,
  permissionScopes: [],
};
