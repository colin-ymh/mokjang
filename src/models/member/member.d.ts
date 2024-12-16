import { BAPTISM, FAMILY, MARRIAGE, NULL } from "@/constants/constant";

export type FamilyMember = {
  meId: string;
  familyMemberId: string;
  relation: FAMILY;
  familyMember: Member;
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
  familyId: string;
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
  ministryId: string; // 사역
  groupId: string; // 소그룹
  officerId: string; // 직분
  officerStartDate: string;
  officerStartChurch: string;
  educationId: NULL;
  previousChurchName: string; // 이전 교회
};
