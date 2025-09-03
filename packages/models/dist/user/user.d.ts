import { USER_ROLE } from '@mokjang/constants';
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
export declare const DEFAULT_USER: User;
