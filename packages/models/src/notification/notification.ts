import { ACTION, DOMAIN } from '../permission';
import { BLANK } from '@mokjang/constants';

export type Notification = {
  id: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  churchUserId: string;
  actorName?: string;
  domain?: DOMAIN;
  action?: ACTION;
  domainTitle?: string;
  isRead: boolean;
  payload: Payload[];
  sourceInfo?: any;
};

export const DEFAULT_NOTIFICATION: Notification = {
  id: BLANK,
  createdAt: BLANK,
  updatedAt: BLANK,
  expiresAt: BLANK,
  churchUserId: BLANK,
  isRead: false,
  payload: [],
};

export type Payload = {
  fields: any;
  previous: any;
  current: any;
};
