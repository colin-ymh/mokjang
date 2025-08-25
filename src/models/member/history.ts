import { BLANK, MINISTRY_GROUP_ROLE } from '@/constants/constant';
import {
  DEFAULT_GROUP,
  DEFAULT_MINISTRY_GROUP,
  DEFAULT_OFFICER,
  Group,
  Ministry,
  MinistryGroup,
  Officer,
} from '@/models/management/management';
import {
  DEFAULT_EDUCATION_TERM,
  EducationTerm,
} from '@/models/education/education';
import { EDUCATION_ENROLLMENT_STATUS, STATUS } from '@/constants/status/status';

export type GroupHistory = {
  id: string;
  groupId: string;
  groupSnapShot: string;
  startDate: string;
  endDate: string;
  group: Group;
};

export const DEFAULT_GROUP_HISTORY: GroupHistory = {
  id: BLANK,
  groupId: BLANK,
  groupSnapShot: BLANK,
  startDate: BLANK,
  endDate: BLANK,
  group: DEFAULT_GROUP,
};

export type GroupDetailHistory = {
  id: string;
  memberId: string;
  groupHistoryId: string;
  role: 'leader';
  startDate: string;
  endDate: string;
};

export const DEFAULT_GROUP_DETAIL_HISTORY: GroupDetailHistory = {
  id: BLANK,
  memberId: BLANK,
  groupHistoryId: BLANK,
  role: 'leader',
  startDate: BLANK,
  endDate: BLANK,
};

export type EducationHistory = {
  id: string;
  educationTerm: EducationTerm;
  educationTermId: string;
  memberId: string;
  memberName: string;
  note: string;
  status: EDUCATION_ENROLLMENT_STATUS;
};

export const DEFAULT_EDUCATION_HISTORY: EducationHistory = {
  id: BLANK,
  educationTerm: DEFAULT_EDUCATION_TERM,
  educationTermId: BLANK,
  memberId: BLANK,
  memberName: BLANK,
  note: BLANK,
  status: STATUS.INCOMPLETE,
};

export type MinistryHistory = {
  id: string;
  memberId: string;
  ministryGroup: MinistryGroup;
  ministrySnapShot: string;
  ministryGroupSnapShot: string;
  startDate: string;
  endDate: string;
  ministryGroupDetailHistory: MinistryDetailHistory[];
};

export const DEFAULT_MINISTRY_HISTORY: MinistryHistory = {
  id: BLANK,
  memberId: BLANK,
  ministryGroup: DEFAULT_MINISTRY_GROUP,
  ministrySnapShot: BLANK,
  ministryGroupSnapShot: BLANK,
  startDate: BLANK,
  endDate: BLANK,
  ministryGroupDetailHistory: [],
};

export enum MINISTRY_DETAIL_TYPE {
  MINISTRY = 'ministry',
  ROLE = 'role',
}
export type MinistryDetailHistory = {
  id: string;
  startDate: string;
  endDate: string;
  type?: MINISTRY_DETAIL_TYPE;
  detail?: {
    ministryId?: string;
    ministryName?: string;
    role?: MINISTRY_GROUP_ROLE;
  };

  role?: MINISTRY_GROUP_ROLE;
  ministry?: Ministry;
};

export const DEFAULT_MINISTRY_DETAIL_HISTORY: MinistryDetailHistory = {
  id: BLANK,
  startDate: BLANK,
  endDate: BLANK,
};

export type OfficerHistory = {
  id: string;
  memberId: string;
  officerId: string;
  officerSnapShot: string;
  officerStartChurch?: string;
  startDate: string;
  endDate: string;
  officer: Officer;
};

export const DEFAULT_OFFICER_HISTORY: OfficerHistory = {
  id: BLANK,
  memberId: BLANK,
  officerId: BLANK,
  officerSnapShot: BLANK,
  officerStartChurch: BLANK,
  startDate: BLANK,
  endDate: BLANK,
  officer: DEFAULT_OFFICER,
};
