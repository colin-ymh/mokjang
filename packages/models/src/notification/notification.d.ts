import { ACTION, DOMAIN } from '../permission';

export type Notification = {
  id: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  churchUserId: string;
  actorName: string;
  domain: DOMAIN;
  action: ACTION;
  domainTitle: string;
  isRead: boolean;
};
