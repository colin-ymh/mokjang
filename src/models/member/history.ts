import { BLANK, EDUCATION_STATUS } from '@/constants/constant';
import {
  DEFAULT_EDUCATION_TERM,
  EducationTerm,
} from '@/models/management/management';

export type GroupHistory = {
  id: string;
  groupId: string;
  groupName: string;
  groupRoleId: string;
  groupRoleName: string;
  startDate: string;
  endDate: string;
};

export const DEFAULT_GROUP_HISTORY: GroupHistory = {
  id: BLANK,
  groupId: BLANK,
  groupName: BLANK,
  groupRoleId: BLANK,
  groupRoleName: BLANK,
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
  status: EDUCATION_STATUS;
};

export const DEFAULT_EDUCATION_HISTORY: EducationHistory = {
  id: BLANK,
  educationTerm: DEFAULT_EDUCATION_TERM,
  educationTermId: BLANK,
  memberId: BLANK,
  memberName: BLANK,
  note: BLANK,
  status: EDUCATION_STATUS.IN_PROGRESS,
};
