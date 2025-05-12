import { VISITATION_STATUS } from '@/models/visitation/visitation';
import { STATUS_COLOR, WHITE } from '@/constants/styles/color';
import { TASK_STATUS } from '@/models/task/task';

export const getVisitationStatusColor = (status: VISITATION_STATUS) => {
  switch (status) {
    case VISITATION_STATUS.DONE:
      return STATUS_COLOR.DONE;
    case VISITATION_STATUS.RESERVE:
      return STATUS_COLOR.RESERVE;
    case VISITATION_STATUS.PENDING:
      return STATUS_COLOR.PENDING;
    default:
      return WHITE;
  }
};

export const getTaskStatusColor = (status: TASK_STATUS) => {
  switch (status) {
    case TASK_STATUS.DONE:
      return STATUS_COLOR.DONE;
    case TASK_STATUS.IN_PROGRESS:
      return STATUS_COLOR.IN_PROGRESS;
    case TASK_STATUS.RESERVE:
      return STATUS_COLOR.RESERVE;
    case TASK_STATUS.PENDING:
      return STATUS_COLOR.PENDING;
    default:
      return WHITE;
  }
};

export const getEducationTermStatusColor = (status: TASK_STATUS) => {
  switch (status) {
    case TASK_STATUS.DONE:
      return STATUS_COLOR.DONE;
    case TASK_STATUS.IN_PROGRESS:
      return STATUS_COLOR.IN_PROGRESS;
    case TASK_STATUS.RESERVE:
      return STATUS_COLOR.RESERVE;
    case TASK_STATUS.PENDING:
      return STATUS_COLOR.PENDING;
    default:
      return WHITE;
  }
};
