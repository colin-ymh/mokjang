import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';
import { STATUS, VISITATION_STATUS } from '@/constants/status/status';
import { VisitationReport } from '@/models/report/report';

export enum VISITATION_METHOD {
  IN_PERSON = 'inPerson',
  REMOTE = 'remote',
}

export enum VISITATION_TYPE {
  SINGLE = 'single',
  GROUP = 'group',
}

export type VisitationDetail = {
  memberId: string;
  visitationContent: string;
  visitationPray: string;
  member?: Member;
  id?: string;
};

export type Visitation = {
  id: string;
  churchId: string;
  status: VISITATION_STATUS;
  visitationMethod: VISITATION_METHOD;
  title: string;
  inChargeId: string;
  startDate: string;
  endDate: string;
  visitationDetails: VisitationDetail[];
  receiverIds: string[];
  creatorId: string;
  members: Member[];
  inCharge: Member;
  creator: Member;
  reports: VisitationReport[];
};

export const DEFAULT_VISITATION_DETAIL: VisitationDetail = {
  memberId: BLANK,
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
};
