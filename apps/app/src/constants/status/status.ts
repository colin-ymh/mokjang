export enum STATUS {
  RESERVE = 'reserve',
  IN_PROGRESS = 'inProgress',
  DONE = 'done',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
  INCOMPLETE = 'incomplete',
  PRESENT = 'present',
  ABSENT = 'absent',
  NONE = 'none',
}

export type TASK_STATUS =
  | STATUS.RESERVE
  | STATUS.DONE
  | STATUS.PENDING
  | STATUS.IN_PROGRESS;

export type JOIN_REQUEST_STATUS =
  | STATUS.PENDING
  | STATUS.APPROVED
  | STATUS.REJECTED
  | STATUS.CANCELED;

// 교육 이수상태
export type EDUCATION_ENROLLMENT_STATUS =
  | STATUS.INCOMPLETE
  | STATUS.COMPLETED
  | STATUS.IN_PROGRESS;

export type EDUCATION_ATTENDANCE_STATUS =
  | STATUS.PRESENT
  | STATUS.ABSENT
  | STATUS.NONE;
