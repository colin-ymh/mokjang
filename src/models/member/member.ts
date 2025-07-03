import { BAPTISM, BLANK, FAMILY, MARRIAGE, NULL } from '@/constants/constant';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';
import {
  Group,
  GroupRole,
  Ministry,
  Officer,
} from '@/models/management/management';
import { Education } from '@/models/education/education';

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
  gender: string;
  groupId?: string;
  groupRoleId?: string;
  group?: Group;
  groupRole?: GroupRole;
  ministries?: Ministry[];
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
  marriage: MARRIAGE | typeof NULL;
  detailMarriage: string;
  vehicleNumber: string[];
  guidedById: string;
  baptism: BAPTISM;
  registeredAt: string;
  updatedAt: string;

  isConcealed: boolean;
};
