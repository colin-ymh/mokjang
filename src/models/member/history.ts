import { BLANK } from '@/constants/constant';
import { DEFAULT_OFFICER, Officer } from '@/models/management/management';
import {
  DEFAULT_EDUCATION_TERM,
  EDUCATION_ENROLLMENT_STATUS,
  EducationTerm,
} from '@/models/education/education';

export type GroupHistory = {
  id: string;
  groupId: string;
  groupRoleId: string;
  groupSnapShot: string;
  groupRoleSnapShot: string;
  startDate: string;
  endDate: string;
};

export const DEFAULT_GROUP_HISTORY: GroupHistory = {
  id: BLANK,
  groupId: BLANK,
  groupSnapShot: BLANK,
  groupRoleId: BLANK,
  groupRoleSnapShot: BLANK,
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
  status: EDUCATION_ENROLLMENT_STATUS.INCOMPLETE,
};

export type MinistryHistory = {
  id: string;
  memberId: string;
  ministrySnapShot: string;
  ministryGroupSnapShot: string;
  startDate: string;
  endDate: string;
  // ministry:
};

export const DEFAULT_MINISTRY_HISTORY: MinistryHistory = {
  id: BLANK,
  memberId: BLANK,
  ministrySnapShot: BLANK,
  ministryGroupSnapShot: BLANK,
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
