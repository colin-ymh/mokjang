import { Group } from '../management/management';
export declare enum DOMAIN {
    MEMBER = "member",
    VISITATION = "visitation",
    TASK = "task",
    EDUCATION = "education",
    EDUCATION_TERM = "educationTerm",
    EDUCATION_SESSION = "educationSession",
    MANAGEMENT = "management",
    HOLIDAY = "holiday",
    CHURCH_EVENT = "churchEvent",
    CHURCH = "church",
    MANAGER = "manager"
}
export type PERMISSION_DOMAIN = DOMAIN.MEMBER | DOMAIN.VISITATION | DOMAIN.EDUCATION | DOMAIN.TASK | DOMAIN.CHURCH | DOMAIN.MANAGER;
export declare enum ACTION {
    READ = "read",
    WRITE = "write"
}
export type PermissionUnit = {
    id: number;
    domain: PERMISSION_DOMAIN;
    action: ACTION;
};
export type PermissionTemplate = {
    id: string;
    churchId: string;
    title: string;
    description: string;
    memberCount: number;
    unitIds: number[];
    permissionUnits: PermissionUnit[];
};
export declare const DEFAULT_PERMISSION_TEMPLATE: PermissionTemplate;
export type PermissionScope = {
    id: string;
    isAllGroups: boolean;
    group: Group;
};
export declare const DEFAULT_PERMISSION_SCOPE: PermissionScope;
