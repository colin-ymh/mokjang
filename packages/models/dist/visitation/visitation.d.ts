import { Member } from '../member/member';
import { TASK_STATUS } from '@mokjang/constants';
import { VisitationReport } from '../report/report';
export declare enum VISITATION_METHOD {
    IN_PERSON = "inPerson",
    REMOTE = "remote"
}
export declare enum VISITATION_TYPE {
    SINGLE = "single",
    GROUP = "group"
}
export type VisitationDetail = {
    visitationContent: string;
    visitationPray: string;
    member?: Member;
    id?: string;
};
export type Visitation = {
    id: string;
    churchId: string;
    status: TASK_STATUS;
    visitationMethod: VISITATION_METHOD;
    title: string;
    inChargeId: string;
    startDate: string;
    endDate: string;
    visitationDetails: [VisitationDetail];
    receiverIds: string[];
    creatorId: string;
    members: Member[];
    inCharge: Member;
    creator: Member;
    reports: VisitationReport[];
    visitationType: VISITATION_TYPE;
};
export declare const DEFAULT_VISITATION_DETAIL: VisitationDetail;
export declare const DEFAULT_VISITATION: Visitation;
