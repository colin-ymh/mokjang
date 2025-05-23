import { BLANK } from '@/constants/constant';

export type Church = {
  id: string;
  name: string;
  identifyNumber: string;
  phone: string;
  denomination: string;
  address: string;
  detailAddress: string;
  memberSize: string;
  mainAdminId: string;
  dailyRequestAttempts: number;
  lastRequestDate: string;
  memberCount: number;
};

export const DEFAULT_CHURCH = {
  id: BLANK,
  name: BLANK,
  identifyNumber: BLANK,
  phone: BLANK,
  denomination: BLANK,
  address: BLANK,
  detailAddress: BLANK,
  memberSize: BLANK,
  mainAdminId: BLANK,
  dailyRequestAttempts: 0,
  lastRequestDate: BLANK,
  memberCount: 0,
};
