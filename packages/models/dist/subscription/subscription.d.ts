export declare enum PLAN {
    FREE_TRIAL = "freeTrial",
    BASIC = "basic",
    STANDARD = "standard",
    PLUS = "plus",
    PREMIUM = "premium",
    ENTERPRISE = "enterprise"
}
export declare enum PLAN_STATUS {
    FREE_TRIAL = "freeTrial",
    PENDING = "pending",
    ACTIVE = "active",
    CANCELLED = "cancelled",
    EXPIRED = "expired"
}
export declare enum BILLING_CYCLE {
    MONTHLY = "monthly",
    YEARLY = "yearly"
}
export declare enum PLAN_FUNCTION {
    MEMBER = "member",
    ATTENDANCE = "attendance",
    VISITATION = "visitation",
    EDUCATION = "education",
    TASK = "task"
}
export type Plan = {
    id: PLAN;
    min: number;
    max: number;
    price: number;
    functions: PLAN_FUNCTION[];
};
export declare const PlanList: Plan[];
export type encData = {
    cardNo: string;
    expYear: string;
    expMonth: string;
    idNo: string;
    cardPw: string;
};
export declare const DEFAULT_ENC_DATA: {
    cardNo: string;
    expYear: string;
    expMonth: string;
    idNo: string;
    cardPw: string;
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
export declare const DEFAULT_SUBSCRIPTION_PLAN: SubscriptionPlan;
