import { Church } from '@/models/church/church';
import { BLANK } from '@/constants/constant';

export type User = {
  id: string;
  provider: string;
  providerId: string;
  name: string;
  mobilePhone: string;
  mobilePhoneVerified: boolean;
  privacyPolicyAgreed: boolean;
  adminChurch?: Church;
  managingChurch?: Church;
};

export const DEFAULT_USER: User = {
  id: BLANK,
  provider: BLANK,
  providerId: BLANK,
  name: BLANK,
  mobilePhone: BLANK,
  mobilePhoneVerified: false,
  privacyPolicyAgreed: false,
};
