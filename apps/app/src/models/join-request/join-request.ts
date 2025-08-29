import { BLANK } from '../../constants/constant';
import { JOIN_REQUEST_STATUS, STATUS } from '../../constants/status/status';
import { DEFAULT_USER, User } from '../user/user';

export type JoinRequest = {
  id: string;
  churchId: string;
  status: JOIN_REQUEST_STATUS;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
};

export const DEFAULT_JOIN_REQUEST: JoinRequest = {
  id: BLANK,
  churchId: BLANK,
  status: STATUS.PENDING,
  userId: BLANK,
  user: DEFAULT_USER,
  createdAt: BLANK,
  updatedAt: BLANK,
};
