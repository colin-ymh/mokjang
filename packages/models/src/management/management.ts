import { BLANK } from '@mokjang/constants';

export type Group = {
  id: string | null;
  churchId: string;
  name: string;
  membersCount: number;
  parentGroupId: string | null;
  childGroupIds: string[];
  childGroups?: Group[];
  order: number;
  leaderMemberId: string;
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
  order: 0,
  leaderMemberId: BLANK,
};

export type MinistryGroup = {
  churchId: string;
  name: string;
  parentMinistryGroupId: string | null;
  id: string | null;
  childMinistryGroupIds: string[];
  childMinistryGroups?: MinistryGroup[];
  ministries?: Ministry[];
  leaderMemberId: string;
  membersCount: number;
  order: number;
};

export const DEFAULT_MINISTRY_GROUP = {
  churchId: BLANK,
  name: BLANK,
  parentMinistryGroupId: BLANK,
  id: BLANK,
  childMinistryGroupIds: [],
  leaderMemberId: BLANK,
  membersCount: 0,
  order: 0,
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
