export type Group = {
  id: string;
  churchId: string;
  name: string;
  membersCount: number;
  parentGroupId: string;
  childGroupIds: string[];
  childGroups?: Group[];
};
