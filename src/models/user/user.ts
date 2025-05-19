import { Church, DEFAULT_CHURCH } from '@/models/church/church';
import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';

export type User = {
  id: string;
  provider: string;
  providerId: string;
  name: string;
  mobilePhone: string;
  mobilePhoneVerified: boolean;
  privacyPolicyAgreed: boolean;
  churchId?: string;
  role?: string;
  church: Church;
  member: Member;
};

export const DEFAULT_USER: User = {
  id: BLANK,
  provider: BLANK,
  providerId: BLANK,
  name: BLANK,
  mobilePhone: BLANK,
  mobilePhoneVerified: false,
  privacyPolicyAgreed: false,
  church: DEFAULT_CHURCH,
  member: DEFAULT_MEMBER,
};
