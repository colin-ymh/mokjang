import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';
import { STATUS, VISITATION_STATUS } from '@/constants/status/status';

export enum VISITATION_METHOD {
  IN_PERSON = 'inPerson',
  REMOTE = 'remote',
}

export enum VISITATION_TYPE {
  SINGLE = 'single',
  GROUP = 'group',
}

export type VisitationReport = {
  id: string;
  isConfirmed: boolean;
  isRead: boolean;
  receiver: Member;
};

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
  visitationStatus: VISITATION_STATUS;
  visitationMethod: VISITATION_METHOD;
  visitationTitle: string;
  instructorId: string;
  visitationStartDate: string;
  visitationEndDate: string;
  visitationDetails: VisitationDetail[];
  receiverIds: string[];
  creatorId: string;
  members: Member[];
  instructor: Member;
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
  visitationStatus: STATUS.RESERVE,
  visitationMethod: VISITATION_METHOD.IN_PERSON,
  visitationTitle: BLANK,
  instructorId: BLANK,
  visitationStartDate: BLANK,
  visitationEndDate: BLANK,
  visitationDetails: [DEFAULT_VISITATION_DETAIL],
  receiverIds: [],
  creatorId: BLANK,
  members: [],
  instructor: DEFAULT_MEMBER,
  creator: DEFAULT_MEMBER,
  reports: [],
};
