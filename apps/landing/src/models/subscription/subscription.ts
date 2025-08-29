export enum PLAN {
  FREE_TRIAL = 'freeTrial',
  BASIC = 'basic',
  STANDARD = 'standard',
  PLUS = 'plus',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

export enum PAYMENT_CYCLE {
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

export type SubscriptionPlan = {
  id: PLAN;
  min: number;
  max: number;
  price: number;
  functions: PLAN_FUNCTION[];
};

export const PlanList: SubscriptionPlan[] = [
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
