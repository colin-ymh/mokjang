import { BLANK } from '@/constants/constant';

export enum VISITATION_STATUS {
  RESERVE = 'reserve',
  DONE = 'done',
  PENDING = 'pending',
}

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
};

export type Visitation = {
  visitationStatus: VISITATION_STATUS;
  visitationMethod: VISITATION_METHOD;
  visitationTitle: string;
  instructorId: string;
  visitationDate: string;
  visitationDetail: VisitationDetail;
  receiverIds: string[];
};

export const DEFAULT_VISITATION_DETAIL: VisitationDetail = {
  memberId: BLANK,
  visitationContent: BLANK,
  visitationPray: BLANK,
};

export const DEFAULT_VISITATION: Visitation = {
  visitationStatus: VISITATION_STATUS.RESERVE,
  visitationMethod: VISITATION_METHOD.IN_PERSON,
  visitationTitle: BLANK,
  instructorId: BLANK,
  visitationDate: BLANK,
  visitationDetail: DEFAULT_VISITATION_DETAIL,
  receiverIds: [],
};
