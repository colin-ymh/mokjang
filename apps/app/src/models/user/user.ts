import { BLANK, USER_ROLE } from '../../constants/constant';
import { ChurchUser } from '../church-user/church-user';

export type User = {
  id: string;
  provider: string;
  providerId: string;
  name: string;
  mobilePhone: string;
  mobilePhoneVerified: boolean;
  privacyPolicyAgreed: boolean;
  role: USER_ROLE;
  churchUser: ChurchUser[];
  hasUsedFreeTrial: boolean;
};

export const DEFAULT_USER: User = {
  id: BLANK,
  provider: BLANK,
  providerId: BLANK,
  name: BLANK,
  mobilePhone: BLANK,
  mobilePhoneVerified: false,
  privacyPolicyAgreed: false,
  role: USER_ROLE.NONE,
  churchUser: [],
  hasUsedFreeTrial: false,
};
