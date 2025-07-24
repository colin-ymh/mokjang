import {
  BAPTISM,
  BLANK,
  FAMILY,
  GENDER,
  GROUP_ROLE,
  MARRIAGE,
} from '@/constants/constant';
import {
  Group,
  Ministry,
  MinistryGroup,
  Officer,
} from '@/models/management/management';
import { Education } from '@/models/education/education';
import { getDateStringFromDate } from '@/utils/date';

export type ChurchInformation = {
  id: string;
  name: string;
};

export type Member = {
  id: string;
  profileImageUrl: string;
  name: string;
  mobilePhone: string;
  isLunar: boolean;
  isLeafMonth: boolean;
  birthdayMMDD: string;
  birth: string;
  gender?: GENDER;
  groupId?: string;
  groupRoleId?: string;
  group?: Group;
  groupRole?: GROUP_ROLE;
  ministries?: Ministry[];
  ministryGroups?: MinistryGroup[];
  educations?: Education[];
  officerId?: string;
  officer?: Officer;
  officerStartChurch?: string;
  officerStartDate?: string;
  previousChurch?: string;
  // 추가 정보
  address: string;
  detailAddress: string;
  homePhone: string;
  familyMemberId: string;
  family: FamilyMember[];
  relation: FAMILY;
  occupation: string;
  school: string;
  marriage?: MARRIAGE;
  detailMarriage: string;
  vehicleNumber: string[];
  guidedById: string;
  baptism: BAPTISM;
  createdAt: string;
  registeredAt: string;
  updatedAt: string;

  isConcealed: boolean;
};

export const DEFAULT_MEMBER: Member = {
  id: BLANK,
  profileImageUrl: BLANK,
  name: BLANK,
  mobilePhone: BLANK,
  homePhone: BLANK,
  detailMarriage: BLANK,
  address: BLANK,
  detailAddress: BLANK,
  school: BLANK,
  occupation: BLANK,
  birth: BLANK,
  isLunar: false,
  guidedById: BLANK,
  vehicleNumber: [BLANK, BLANK, BLANK],
  familyMemberId: BLANK,
  family: [],
  relation: FAMILY.FAMILY,
  // 교회 정보
  registeredAt: getDateStringFromDate(new Date()),
  createdAt: BLANK,
  updatedAt: BLANK,
  officerId: BLANK,
  baptism: BAPTISM.NONE,
  isConcealed: false,
  isLeafMonth: false,
  birthdayMMDD: BLANK,
};

export type FamilyMember = {
  meId: string;
  familyMemberId: string;
  relation: FAMILY;
  familyMember: Member;
};

export const DEFAULT_FAMILY_MEMBER = {
  meId: BLANK,
  familyMemberId: BLANK,
  relation: FAMILY.FAMILY,
  familyMember: DEFAULT_MEMBER,
};
