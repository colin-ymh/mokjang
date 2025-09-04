export type NewMemberSummary = {
    weekOfMonth: number;
    periodStart: string;
    count: number;
};
export declare const getInitialNewMemberSummaries: () => NewMemberSummary[];
