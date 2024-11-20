import { BAPTISM, MEMBER_REGISTER_TYPE } from "@/constant/constant";

export type TemporalMember = {
  // 등록 타입 (새신자, 기존신자)
  type: MEMBER_REGISTER_TYPE;
  // 필수입력값
  name: string;
  mobilePhone: string;
  // 개인정보
  profileImage?: any;
  birth: string;
  gender?: string;
  address: string;
  homePhone: string;
  family?: any;
  occupation: string;
  school: string;
  marriage: string;
  // 성도정보
  ministry?: string; // 사역
  group?: string; // 소그룹
  confirmation: string; // 직분
  confirmationStartDate: string;
  confirmationStartChurch: string;
  createdAt?: string;
  baptism: BAPTISM; // 신급
  guide: any; // 인도자
  previousChurchName: string; // 이전 교회
  vehiclePlateNumber: string;
};
