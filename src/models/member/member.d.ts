import { BAPTISM, MARRIAGE, NONE, NULL } from "@/constants/constant";

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
  occupation: string;
  school: string;
  marriage: MARRIAGE | typeof NULL;
  detailMarriage: string;
  // 성도정보
  ministry: string; // 사역
  group: string; // 소그룹
  officer: string; // 직분
  officerStartDate: string;
  officerStartChurch: string;
  baptism: BAPTISM; // 신급
  guidedById: string; // 인도자 id
  previousChurchName: string; // 이전 교회
  vehicleNumber: string[];
  education: string;
};
