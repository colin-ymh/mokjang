export declare enum NOTIFICATION_DOMAIN {
    TASK = "task",
    VISITATION = "visitation",
    EDUCATION_TERM = "educationTerm",
    EDUCATION_SESSION = "educationSession",
    MANAGER = "manager",
    PERMISSION = "permission",
    CHURCH_INFO = "churchInfo",
    WORSHIP = "worship"
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
    REPORT_REMOVED = "reportRemoved"
}
export declare enum PAYLOAD_FIELD {
    TITLE = "title",
    CONTENT = "content",
    START_DATE = "startDate",
    END_DATE = "endDate",
    STATUS = "status",
    VISITATION_METHOD = "visitationMethod",
    MEMBERS = "members",
    LOCATION = "location",
    IN_CHARGE = "inCharge",
    ENROLLMENTS = "enrollments",
    ADDRESS = "address",
    DETAIL_ADDRESS = "detailAddress"
}
export type Notification = {
    id: string;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
    churchUserId: string;
    actorName: string;
    domain: NOTIFICATION_DOMAIN;
    action: NOTIFICATION_ACTION;
    domainTitle: string;
    isRead: boolean;
    payload: Payload[];
    sourceInfo?: SourceInfo;
};
export declare const DEFAULT_NOTIFICATION: Notification;
export type Payload = {
    fields: PAYLOAD_FIELD;
    current?: string;
    previous?: string;
};
export type SourceInfo = {
    id: string;
    domain: NOTIFICATION_DOMAIN;
    educationId?: string;
    educationTermId?: string;
};
