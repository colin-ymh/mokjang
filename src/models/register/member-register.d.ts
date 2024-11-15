export type MemberRegisterType = {
  // 필수입력값
  name: string;
  personalPhone: string;
  // 개인정보
  profileImage?: any;
  birth?: string;
  gender?: string;
  address?: string;
  homePhone?: string;
  family?: any;
  job?: string;
  school?: string;
  marriage?: string;
  // 성도정보
  ministry?: string; // 사역
  group?: string; // 소그룹
  officer?: string; // 직분
  officerStartDate?: string;
  officerStartChurch?: string;
  createdAt?: string;
  reborn?: string; // 신급
  guide?: any; // 인도자
  carNumber?: string;
};
