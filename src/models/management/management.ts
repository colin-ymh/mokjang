import { BLANK } from '@/constants/constant';

export type Group = {
  id: string | null;
  churchId: string;
  name: string;
  membersCount: number;
  parentGroupId: string | null;
  childGroupIds: string[];
  childGroups?: Group[];
  roles: GroupRole[];
  order: number;
  // members: Member[];
};

export const DEFAULT_GROUP = {
  id: BLANK,
  churchId: BLANK,
  name: BLANK,
  membersCount: 0,
  parentGroupId: BLANK,
  childGroupIds: [],
  members: [],
  roles: [],
  order: 0,
};

export type GroupRole = {
  id: string;
  churchId: string;
  groupId: string;
  role: string;
};

export const DEFAULT_GROUP_ROLE = {
  id: BLANK,
  churchId: BLANK,
  groupId: BLANK,
  role: BLANK,
};

export type MinistryGroup = {
  churchId: string;
  name: string;
  parentMinistryGroupId: string | null;
  id: string | null;
  childMinistryGroupIds: string[];
  childMinistryGroups?: MinistryGroup[];
  ministries?: Ministry[];
};

export const DEFAULT_MINISTRY_GROUP = {
  churchId: BLANK,
  name: BLANK,
  parentMinistryGroupId: BLANK,
  id: BLANK,
  childMinistryGroupIds: [],
};

export type Ministry = {
  id: string;
  name: string;
  membersCount: number;
  churchId: string;
  ministryGroupId: string;
  ministryGroup?: MinistryGroup;
};

export const DEFAULT_MINISTRY = {
  id: BLANK,
  name: BLANK,
  membersCount: 0,
  churchId: BLANK,
  ministryGroupId: BLANK,
};

export type Officer = {
  id: string;
  churchId?: string;
  name: string;
  membersCount?: number;
  order: number;
};

export const DEFAULT_OFFICER: Officer = {
  id: BLANK,
  churchId: BLANK,
  name: BLANK,
  membersCount: 0,
  order: 0,
};
