import { STATUS_COLOR, WHITE } from '@/constants/styles/color';
import { STATUS } from '@/constants/status/status';

export const getStatusColor = (status: STATUS) => {
  switch (status) {
    case STATUS.DONE:
      return STATUS_COLOR.DONE;
    case STATUS.IN_PROGRESS:
      return STATUS_COLOR.IN_PROGRESS;
    case STATUS.RESERVE:
      return STATUS_COLOR.RESERVE;
    case STATUS.PENDING:
      return STATUS_COLOR.PENDING;
    default:
      return WHITE;
  }
};
