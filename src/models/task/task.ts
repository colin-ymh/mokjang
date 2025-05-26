import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';
import { STATUS, TASK_STATUS } from '@/constants/status/status';
import { TaskReport } from '@/models/report/report';

export type Task = {
  id: string;
  churchId: string;
  status: TASK_STATUS;
  title: string;
  startDate: string;
  endDate: string;
  content: string;
  parentTaskId: string;
  inChargeId: string;
  creatorId: string;
  inCharge: Member;
  creator: Member;
  subTasks: Task[];
  reports: TaskReport[];
  receiverIds: string[];
};

export const DEFAULT_TASK: Task = {
  id: BLANK,
  churchId: BLANK,
  status: STATUS.RESERVE,
  title: BLANK,
  startDate: BLANK,
  endDate: BLANK,
  content: BLANK,
  parentTaskId: BLANK,
  inChargeId: BLANK,
  creatorId: BLANK,
  creator: DEFAULT_MEMBER,
  inCharge: DEFAULT_MEMBER,
  subTasks: [],
  reports: [],
  receiverIds: [],
};
