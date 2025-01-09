import { BLANK, EDUCATION_STATUS } from '@/constants/constant';

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
  educationId: string;
  educationName: string;
  memberId: string;
  status: EDUCATION_STATUS;
  startDate: string;
  endDate?: string;
};

export const DEFAULT_EDUCATION_HISTORY: EducationHistory = {
  id: BLANK,
  educationId: BLANK,
  educationName: BLANK,
  memberId: BLANK,
  status: EDUCATION_STATUS.IN_PROGRESS,
  startDate: BLANK,
};
