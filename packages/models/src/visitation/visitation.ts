import { BLANK } from '@mokjang/constants';
import { DEFAULT_MEMBER, Member } from '../member/member';
import { STATUS, TASK_STATUS } from '@mokjang/constants';
import { VisitationReport } from '../report/report';

export enum VISITATION_METHOD {
  IN_PERSON = 'inPerson',
  REMOTE = 'remote',
}

export enum VISITATION_TYPE {
  SINGLE = 'single',
  GROUP = 'group',
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

export const DEFAULT_VISITATION_DETAIL: VisitationDetail = {
  visitationContent: BLANK,
  visitationPray: BLANK,
};

export const DEFAULT_VISITATION: Visitation = {
  id: BLANK,
  churchId: BLANK,
  status: STATUS.RESERVE,
  visitationMethod: VISITATION_METHOD.IN_PERSON,
  title: BLANK,
  inChargeId: BLANK,
  startDate: BLANK,
  endDate: BLANK,
  visitationDetails: [DEFAULT_VISITATION_DETAIL],
  receiverIds: [],
  creatorId: BLANK,
  members: [],
  inCharge: DEFAULT_MEMBER,
  creator: DEFAULT_MEMBER,
  reports: [],
  visitationType: VISITATION_TYPE.SINGLE,
};
