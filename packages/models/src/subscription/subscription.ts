import { BLANK } from '@mokjang/constants';

export enum PLAN {
  FREE_TRIAL = 'freeTrial',
  BASIC = 'basic',
  STANDARD = 'standard',
  PLUS = 'plus',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

export enum PLAN_STATUS {
  FREE_TRIAL = 'freeTrial',
  PENDING = 'pending',
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum BILLING_CYCLE {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum PLAN_FUNCTION {
  MEMBER = 'member',
  ATTENDANCE = 'attendance',
  VISITATION = 'visitation',
  EDUCATION = 'education',
  TASK = 'task',
}

export type Plan = {
  id: PLAN;
  min: number;
  max: number;
  price: number;
  functions: PLAN_FUNCTION[];
};

export const PlanList: Plan[] = [
  {
    id: PLAN.BASIC,
    min: 100,
    max: 300,
    price: 49000,
    functions: Object.values(PLAN_FUNCTION),
  },
  {
    id: PLAN.STANDARD,
    min: 300,
    max: 500,
    price: 79000,
    functions: Object.values(PLAN_FUNCTION),
  },
  {
    id: PLAN.PLUS,
    min: 500,
    max: 1000,
    price: 129000,
    functions: Object.values(PLAN_FUNCTION),
  },
  {
    id: PLAN.PREMIUM,
    min: 1000,
    max: 3000,
    price: 199000,
    functions: Object.values(PLAN_FUNCTION),
  },
];

export type encData = {
  cardNo: string;
  expYear: string;
  expMonth: string;
  idNo: string;
  cardPw: string;
};

export const DEFAULT_ENC_DATA = {
  cardNo: BLANK,
  expYear: BLANK,
  expMonth: BLANK,
  idNo: BLANK,
  cardPw: BLANK,
};

export type SubscriptionPlan = {
  id: string;
  isCurrent: boolean;
  userId: string;
  currentPlan?: PLAN;
  status?: PLAN_STATUS;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  billingCycle?: BILLING_CYCLE;
  nextBillingDate?: string;
  amount?: number;
  autoRenew?: boolean;
  isFreeTrial?: boolean;
  trialEndsAt?: string;
  maxMembers?: number;
  bid?: string;
};

export const DEFAULT_SUBSCRIPTION_PLAN: SubscriptionPlan = {
  id: BLANK,
  isCurrent: false,
  userId: BLANK,
};
