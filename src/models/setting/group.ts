import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';

export type Group = {
  id: string | null;
  churchId: string;
  name: string;
  membersCount: number;
  parentGroupId: string | null;
  childGroupIds: string[];
  childGroups?: Group[];
  members: Member[];
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
