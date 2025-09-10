export declare enum NOTIFICATION_DOMAIN {
    TASK = "task",
    VISITATION = "visitation",
    EDUCATION_TERM = "educationTerm",
    EDUCATION_SESSION = "educationSession",
    WORSHIP_ATTENDANCE = "worshipAttendance",
    PERMISSION = "permission",
    CHURCH_INFO = "churchInfo"
}
export declare enum NOTIFICATION_ACTION {
    CREATED = "created",
    UPDATED = "updated",
    STATUS_UPDATED = "statusUpdated",
    DELETED = "deleted",
    IN_CHARGE_ADDED = "inChargedAdded",
    IN_CHARGE_REMOVED = "inChargedRemoved",
    IN_CHARGE_CHANGED = "inChargeChanged",
    REPORT_ADDED = "reportAdded",
    REPORT_REMOVED = "reportRemoved",
    MANAGER_UPDATED = "managerUpdated",
    CHURCH_INFO_UPDATED = "churchInfoUpdated"
}
export type Notification = {
    id: string;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
    churchUserId: string;
    actorName?: string;
    domain?: NOTIFICATION_DOMAIN;
    action?: NOTIFICATION_ACTION;
    domainTitle?: string;
    isRead: boolean;
    payload: Payload[];
    sourceInfo?: any;
};
export declare const DEFAULT_NOTIFICATION: Notification;
export type Payload = {
    fields: any;
    previous: any;
    current: any;
};
