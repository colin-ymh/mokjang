import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';
import { VisitationReport } from '@/models/visitation/visitation';

export enum TASK_STATUS {
  RESERVE = 'reserve',
  IN_PROGRESS = 'inProgress',
  DONE = 'done',
  PENDING = 'pending',
}

export type Task = {
  id: string;
  churchId: string;
  taskStatus: TASK_STATUS;
  title: string;
  taskStartDate: string;
  taskEndDate: string;
  comment: string;
  parentTaskId: string;
  inChargeId: string;
  creatorId: string;
  inCharge: Member;
  creator: Member;
  subTasks: Task[];
  reports: VisitationReport[];
  receiverIds: string[];
};

export const DEFAULT_TASK: Task = {
  id: BLANK,
  churchId: BLANK,
  taskStatus: TASK_STATUS.RESERVE,
  title: BLANK,
  taskStartDate: BLANK,
  taskEndDate: BLANK,
  comment: BLANK,
  parentTaskId: BLANK,
  inChargeId: BLANK,
  creatorId: BLANK,
  creator: DEFAULT_MEMBER,
  inCharge: DEFAULT_MEMBER,
  subTasks: [],
  reports: [],
  receiverIds: [],
};
