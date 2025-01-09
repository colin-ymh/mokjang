import { BLANK } from '@/constants/constant';

export type Group = {
  id: string | null;
  churchId: string;
  name: string;
  membersCount: number;
  parentGroupId: string | null;
  childGroupIds: string[];
  childGroups?: Group[];
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
};

export type Education = {
  id: string;
  churchId: string;
  name: string;
  membersCount: number;
  inProgressCount: number;
  completedCount: number;
  incompleteCount: number;
};

export const DEFAULT_EDUCATION = {
  id: BLANK,
  churchId: BLANK,
  name: BLANK,
  membersCount: 0,
  inProgressCount: 0,
  completedCount: 0,
  incompleteCount: 0,
};

export type Officer = {
  id: string;
  churchId: string;
  name: string;
  membersCount: number;
};

export const DEFAULT_OFFICER: Officer = {
  id: BLANK,
  churchId: BLANK,
  name: BLANK,
  membersCount: 0,
};
