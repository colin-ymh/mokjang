import {
  BAPTISM,
  CONFIRMATION,
  MARRIAGE,
  MEMBER_REGISTER_TYPE,
} from "@/constant/constant";

export type TemporalMember = {
  // 등록 타입 (새신자, 기존신자)
  type: MEMBER_REGISTER_TYPE;
  // 필수입력값
  name: string;
  mobilePhone: string;
  // 개인정보
  profileImage: string;
  birth: string;
  isLunar: boolean;
  gender: string;
  address: string;
  detailAddress: string;
  homePhone: string;
  family: string;
  occupation: string;
  school: string;
  marriage: MARRIAGE | NONE;
  detailMarriage: string;
  // 성도정보
  ministry?: string; // 사역
  group?: string; // 소그룹
  confirmation: CONFIRMATION | NONE; // 직분
  confirmationStartDate: string;
  confirmationStartChurch: string;
  createdAt?: string;
  baptism: BAPTISM | NONE; // 신급
  guide: any; // 인도자
  previousChurchName: string; // 이전 교회
  vehicleNumber: string[];
};
