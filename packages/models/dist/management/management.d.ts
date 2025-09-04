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
};
export declare const DEFAULT_GROUP: {
    id: string;
    churchId: string;
    name: string;
    membersCount: number;
    parentGroupId: string;
    childGroupIds: never[];
    members: never[];
    order: number;
    leaderMemberId: string;
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
export declare const DEFAULT_MINISTRY_GROUP: {
    churchId: string;
    name: string;
    parentMinistryGroupId: string;
    id: string;
    childMinistryGroupIds: never[];
    leaderMemberId: string;
    membersCount: number;
    order: number;
};
export type Ministry = {
    id: string;
    name: string;
    membersCount: number;
    churchId: string;
    ministryGroupId: string;
    ministryGroup?: MinistryGroup;
};
export declare const DEFAULT_MINISTRY: {
    id: string;
    name: string;
    membersCount: number;
    churchId: string;
    ministryGroupId: string;
};
export type Officer = {
    id: string;
    churchId?: string;
    name: string;
    membersCount?: number;
    order: number;
};
export declare const DEFAULT_OFFICER: Officer;
