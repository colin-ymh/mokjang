import { BAPTISM, BLANK, FAMILY, MARRIAGE, NULL } from '@/constants/constant';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';

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
  name: string;
  mobilePhone: string;
  profileImage: string;
  birth: string;
  isLunar: boolean;
  gender: string;
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
  guidedById: string; // 인도자 id
  // 성도정보
  baptism: BAPTISM; // 신급
  ministries: ChurchInformation[];
  groupId: string; // 소그룹
  group: ChurchInformation;
  officerId: string; // 직분
  officer: ChurchInformation;
  officerStartDate: string;
  officerStartChurch: string;
  educations: ChurchInformation[];
  previousChurchName: string; // 이전 교회
  //
  registeredAt: string;
  updatedAt: string;
};
