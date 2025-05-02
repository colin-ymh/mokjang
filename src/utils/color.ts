import { VISITATION_STATUS } from '@/models/visitation/visitation';
import { STATUS_COLOR, WHITE } from '@/constants/styles/color';

export const getStatusColor = (status: VISITATION_STATUS) => {
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
